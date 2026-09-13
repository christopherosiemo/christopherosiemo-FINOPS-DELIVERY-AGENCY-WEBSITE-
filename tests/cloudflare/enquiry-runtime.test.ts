/// <reference types="@cloudflare/vitest-plugin/types" />

import { env, runInDurableObject } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import { CloudflareEmailDelivery } from "../../src/lib/enquiry/delivery";
import { DurableObjectEnquiryRateLimit, pseudonymousNetworkKey } from "../../src/lib/enquiry/rate-limit";
import type { EnquiryPayload } from "../../src/lib/enquiry/types";

const payload: EnquiryPayload = {
  email: "alex@example.test",
  name: "Alex Engineer",
  company: "Example Infrastructure Ltd",
  awsContext: "A multi-account AWS estate with material RDS cost pressure.",
  priority: "Rightsizing is blocked by unclear service ownership.",
  spendRange: "25k-100k",
  requestId: "enq-runtime01",
  receivedAt: "2026-09-13T10:00:00.000Z",
};

const privateDestination = "verified-destination@example.test";

describe("Cloudflare enquiry runtime", () => {
  it("persists five timestamp-only attempts and rejects the sixth atomically", async () => {
    const limiter = new DurableObjectEnquiryRateLimit(env.ENQUIRY_RATE_LIMITER, "runtime-secret", "203.0.113.7");
    const timestamp = "2026-09-13T10:00:00.000Z";
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      await expect(limiter.check({ timestamp })).resolves.toEqual({ allowed: true });
    }
    await expect(limiter.check({ timestamp })).resolves.toMatchObject({ allowed: false });
  });

  it("keeps pseudonymous keys independent, resets expired windows, and buckets a missing IP", async () => {
    const first = new DurableObjectEnquiryRateLimit(env.ENQUIRY_RATE_LIMITER, "runtime-secret", "198.51.100.1");
    const second = new DurableObjectEnquiryRateLimit(env.ENQUIRY_RATE_LIMITER, "runtime-secret", "198.51.100.2");
    for (let attempt = 0; attempt < 5; attempt += 1) {
      await first.check({ timestamp: "2026-09-13T10:00:00.000Z" });
    }
    await expect(second.check({ timestamp: "2026-09-13T10:00:00.000Z" })).resolves.toEqual({ allowed: true });
    await expect(first.check({ timestamp: "2026-09-13T10:15:00.001Z" })).resolves.toEqual({ allowed: true });
    await expect(pseudonymousNetworkKey("runtime-secret", undefined)).resolves.toHaveLength(64);
  });

  it("serializes concurrent attempts and stores timestamps without raw IP or PII", async () => {
    const ipAddress = "192.0.2.44";
    const secret = "concurrency-secret";
    const limiter = new DurableObjectEnquiryRateLimit(env.ENQUIRY_RATE_LIMITER, secret, ipAddress);
    const decisions = await Promise.all(Array.from({ length: 6 }, () => limiter.check({ timestamp: "2026-09-13T11:00:00.000Z" })));
    expect(decisions.filter((decision) => decision.allowed)).toHaveLength(5);
    const key = await pseudonymousNetworkKey(secret, ipAddress);
    const stub = env.ENQUIRY_RATE_LIMITER.getByName(key);
    const stored = await runInDurableObject(stub, (_instance, state) => ({
      columns: [...state.storage.sql.exec<{ name: string }>("PRAGMA table_info(attempts)")].map(({ name }) => name),
      rows: [...state.storage.sql.exec<{ attempted_at: number }>("SELECT attempted_at FROM attempts")],
    }));
    expect(stored.columns).toEqual(["attempted_at"]);
    expect(stored.rows).toHaveLength(5);
    expect(JSON.stringify(stored)).not.toContain(ipAddress);
    for (const pii of [payload.email, payload.name, payload.company, payload.awsContext, payload.priority]) {
      expect(JSON.stringify(stored)).not.toContain(pii);
    }
  });

  it("uses the Workers email binding shape without leaking security data", async () => {
    const messages: unknown[] = [];
    const binding = { send: async (message: unknown) => { messages.push(message); return { messageId: "cf-message-1" }; } };
    const delivery = new CloudflareEmailDelivery(binding, privateDestination);
    await expect(delivery.deliver(payload)).resolves.toEqual({ ok: true, externalId: "cf-message-1" });
    const serialised = JSON.stringify(messages);
    expect(serialised).toContain("HKGpipi Savings Sprint enquiry — enq-runtime01");
    expect(serialised).toContain("enquiries@hkgpipi.com");
    expect(serialised).toContain(privateDestination);
    expect(serialised).toContain("alex@example.test");
    expect(serialised).not.toContain("203.0.113");
    expect(serialised).not.toContain("turnstile");
    expect(serialised).not.toContain("runtime-secret");
  });

  it("classifies provider failures safely and fails closed without a destination", async () => {
    const privateMessage = "PRIVATE MESSAGE MUST NOT LEAK";
    const codedBinding = {
      send: async () => {
        throw Object.assign(new Error(privateMessage), { code: "E_SENDER_NOT_VERIFIED" });
      },
    };
    const coded = await new CloudflareEmailDelivery(codedBinding, privateDestination).deliver(payload);
    expect(coded).toEqual({ ok: false, providerCode: "E_SENDER_NOT_VERIFIED", reason: "rejected", retryable: false });
    expect(JSON.stringify(coded)).not.toContain(privateMessage);

    let sendCalled = false;
    const missing = await new CloudflareEmailDelivery({
      send: async () => {
        sendCalled = true;
        return { messageId: "unexpected" };
      },
    }, undefined).deliver(payload);
    expect(missing).toEqual({ ok: false, reason: "disabled", retryable: true });
    expect(sendCalled).toBe(false);
  });
});
