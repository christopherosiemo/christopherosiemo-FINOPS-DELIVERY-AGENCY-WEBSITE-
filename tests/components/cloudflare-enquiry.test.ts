import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { CloudflareEmailDelivery, createConfiguredDelivery, safeEmailProviderCodes } from "@/lib/enquiry/delivery";
import { readRuntimeConfig, TURNSTILE_ACTION } from "@/lib/enquiry/runtime-config";
import { processEnquirySubmission } from "@/lib/enquiry/submission";
import { CloudflareTurnstileVerification } from "@/lib/enquiry/turnstile";
import type { EnquiryPayload } from "@/lib/enquiry/types";

const payload: EnquiryPayload = {
  email: "alex@example.test",
  name: "Alex Engineer",
  company: "Example Infrastructure Ltd",
  awsContext: "A multi-account AWS estate with material RDS cost pressure.",
  priority: "Rightsizing is blocked by unclear service ownership.",
  spendRange: "25k-100k",
  requestId: "enq-test000001",
  receivedAt: "2026-09-13T10:00:00.000Z",
};

const privateDestination = "verified-destination@example.test";

afterEach(() => vi.unstubAllEnvs());

describe("Turnstile verification", () => {
  const response = (value: unknown, status = 200) => vi.fn().mockResolvedValue(new Response(JSON.stringify(value), { status }));

  it.each([
    ["", "missing-token"],
    ["token", "secret-missing"],
  ])("handles configuration/token failure", async (token, expected) => {
    const verifier = new CloudflareTurnstileVerification(undefined, "hkgpipi.com", response({}));
    await expect(verifier.verify(token)).resolves.toBe(expected);
  });

  it.each([
    [{ success: false, "error-codes": ["invalid-input-response"] }, "invalid-token"],
    [{ success: false, "error-codes": ["timeout-or-duplicate"] }, "expired-or-duplicate"],
    [{ success: true, action: "wrong", hostname: "hkgpipi.com" }, "action-mismatch"],
    [{ success: true, action: TURNSTILE_ACTION, hostname: "other.example" }, "hostname-mismatch"],
    [{ success: true, action: TURNSTILE_ACTION, hostname: "hkgpipi.com" }, "verified"],
  ])("classifies Siteverify outcomes", async (siteverify, expected) => {
    const verifier = new CloudflareTurnstileVerification("secret", "hkgpipi.com", response(siteverify));
    await expect(verifier.verify("token")).resolves.toBe(expected);
  });

  it("fails safely on a Siteverify network failure", async () => {
    const verifier = new CloudflareTurnstileVerification("secret", "hkgpipi.com", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(verifier.verify("token")).resolves.toBe("unavailable");
  });
});

describe("Cloudflare email delivery", () => {
  it("uses the fixed sender/subject, validated reply-to and approved plain-text fields", async () => {
    const send = vi.fn().mockResolvedValue({ messageId: "cf-message-1" });
    const delivery = new CloudflareEmailDelivery({ send }, privateDestination);
    await expect(delivery.deliver(payload)).resolves.toEqual({ ok: true, externalId: "cf-message-1" });
    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      to: privateDestination,
      from: { name: "HKGpipi", email: "enquiries@hkgpipi.com" },
      replyTo: "alex@example.test",
      subject: "HKGpipi Savings Sprint enquiry — enq-test000001",
    }));
    const message = JSON.stringify(send.mock.calls);
    for (const value of ["Alex Engineer", "Example Infrastructure Ltd", "RDS cost pressure", "Rightsizing", "25k-100k"]) expect(message).toContain(value);
    for (const value of ["cf-turnstile-response", "RATE_LIMIT_HMAC_SECRET", "CF-Connecting-IP"]) expect(message).not.toContain(value);
  });

  it("fails closed without calling send when the binding or destination is missing", async () => {
    expect(createConfiguredDelivery({ testMode: false }).type).toBe("disabled");
    expect(createConfiguredDelivery({ binding: { send: vi.fn() }, testMode: false }).type).toBe("disabled");
    const send = vi.fn();
    await expect(new CloudflareEmailDelivery(undefined, privateDestination).deliver(payload))
      .resolves.toEqual({ ok: false, retryable: true, reason: "disabled" });
    await expect(new CloudflareEmailDelivery({ send }, undefined).deliver(payload))
      .resolves.toEqual({ ok: false, retryable: true, reason: "disabled" });
    expect(send).not.toHaveBeenCalled();
  });

  it("allowlists provider codes and conservatively maps retryability without forwarding messages", async () => {
    const privateMessage = "PRIVATE MESSAGE MUST NOT LEAK";
    const codedError = Object.assign(new Error(privateMessage), { code: "E_RECIPIENT_NOT_ALLOWED" });
    const coded = new CloudflareEmailDelivery({ send: vi.fn().mockRejectedValue(codedError) }, privateDestination);
    await expect(coded.deliver(payload)).resolves.toEqual({
      ok: false,
      providerCode: "E_RECIPIENT_NOT_ALLOWED",
      reason: "rejected",
      retryable: false,
    });

    const unknown = new CloudflareEmailDelivery({ send: vi.fn().mockRejectedValue(new Error(privateMessage)) }, privateDestination);
    const result = await unknown.deliver(payload);
    expect(result).toEqual({ ok: false, providerCode: "E_UNKNOWN", reason: "temporary", retryable: true });
    expect(JSON.stringify(result)).not.toContain(privateMessage);
    expect(safeEmailProviderCodes).toContain("E_INTERNAL_SERVER_ERROR");
  });

  it("logs only the safe provider category while browser state remains generic", async () => {
    const privateMessage = "PRIVATE MESSAGE MUST NOT LEAK";
    const send = vi.fn().mockRejectedValue(Object.assign(new Error(privateMessage), { code: "E_RECIPIENT_NOT_ALLOWED" }));
    const formData = new FormData();
    for (const [key, value] of Object.entries({
      email: payload.email,
      name: payload.name,
      company: payload.company,
      awsContext: payload.awsContext,
      priority: payload.priority,
      spendRange: payload.spendRange,
      website: "",
    })) formData.set(key, value);
    const diagnostics: unknown[] = [];
    const state = await processEnquirySubmission(formData, {
      createRequestId: () => payload.requestId,
      delivery: new CloudflareEmailDelivery({ send }, privateDestination),
      log: (diagnostic) => diagnostics.push(diagnostic),
      rateLimit: { check: async () => ({ allowed: true }) },
      verification: { verify: async () => "verified" },
    });
    expect(state).toMatchObject({ status: "delivery-failure", requestId: payload.requestId, values: { email: payload.email } });
    const diagnosticText = JSON.stringify(diagnostics);
    expect(diagnosticText).toContain("email-E_RECIPIENT_NOT_ALLOWED");
    for (const forbidden of [privateDestination, privateMessage, payload.email]) expect(diagnosticText).not.toContain(forbidden);
    expect(JSON.stringify(state)).not.toContain(privateDestination);
    expect(JSON.stringify(state)).not.toContain(privateMessage);
  });
});

describe("environment safety", () => {
  it("permits query-controlled adapters only in the explicit test environment", () => {
    vi.stubEnv("ENQUIRY_TEST_MODE", "1");
    expect(readRuntimeConfig({ APP_ENVIRONMENT: "test" }).testMode).toBe(true);
    expect(() => readRuntimeConfig({ APP_ENVIRONMENT: "staging", TURNSTILE_EXPECTED_HOSTNAME: "stage.example" })).toThrow(/forbidden/);
    expect(() => readRuntimeConfig({ APP_ENVIRONMENT: "production", TURNSTILE_EXPECTED_HOSTNAME: "hkgpipi.com" })).toThrow(/forbidden/);
  });

  it("requires exact staging and production hostnames", () => {
    expect(() => readRuntimeConfig({ APP_ENVIRONMENT: "staging" })).toThrow(/explicit/);
    expect(() => readRuntimeConfig({ APP_ENVIRONMENT: "production", TURNSTILE_EXPECTED_HOSTNAME: "www.hkgpipi.com" })).toThrow(/hkgpipi.com/);
    expect(readRuntimeConfig({ APP_ENVIRONMENT: "production", TURNSTILE_EXPECTED_HOSTNAME: "hkgpipi.com" }).expectedHostname).toBe("hkgpipi.com");
  });

  it("considers real delivery configured only when binding and destination secret both exist", () => {
    const base = { APP_ENVIRONMENT: "staging", TURNSTILE_EXPECTED_HOSTNAME: "stage.example" };
    expect(readRuntimeConfig(base).deliveryConfigured).toBe(false);
    expect(readRuntimeConfig({ ...base, ENQUIRY_EMAIL: { send: vi.fn() } }).deliveryConfigured).toBe(false);
    expect(readRuntimeConfig({ ...base, ENQUIRY_DESTINATION_ADDRESS: privateDestination }).deliveryConfigured).toBe(false);
    expect(readRuntimeConfig({ ...base, ENQUIRY_EMAIL: { send: vi.fn() }, ENQUIRY_DESTINATION_ADDRESS: privateDestination }).deliveryConfigured).toBe(true);
  });
});

describe("Wrangler email binding model", () => {
  it("restricts the sender without committing a destination address", () => {
    const config = JSON.parse(readFileSync("wrangler.jsonc", "utf8")) as {
      send_email: Array<Record<string, unknown>>;
      env: Record<string, { send_email: Array<Record<string, unknown>> }>;
    };
    const bindings = [config.send_email, config.env.staging.send_email, config.env.production.send_email].flat();
    for (const binding of bindings) {
      expect(binding).toMatchObject({ name: "ENQUIRY_EMAIL", allowed_sender_addresses: ["enquiries@hkgpipi.com"] });
      expect(binding).not.toHaveProperty("destination_address");
      expect(binding).not.toHaveProperty("allowed_destination_addresses");
    }
    expect(JSON.stringify(config)).not.toContain("gmail.com");
  });
});
