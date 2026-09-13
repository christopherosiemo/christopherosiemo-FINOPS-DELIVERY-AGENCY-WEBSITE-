import { afterEach, describe, expect, it, vi } from "vitest";
import { CloudflareEmailDelivery, createConfiguredDelivery } from "@/lib/enquiry/delivery";
import { readRuntimeConfig, TURNSTILE_ACTION } from "@/lib/enquiry/runtime-config";
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
    const delivery = new CloudflareEmailDelivery({ send });
    await expect(delivery.deliver(payload)).resolves.toEqual({ ok: true, externalId: "cf-message-1" });
    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      to: undefined,
      from: { name: "HKGpipi", email: "enquiries@hkgpipi.com" },
      replyTo: "alex@example.test",
      subject: "HKGpipi Savings Sprint enquiry — enq-test000001",
    }));
    const message = JSON.stringify(send.mock.calls);
    for (const value of ["Alex Engineer", "Example Infrastructure Ltd", "RDS cost pressure", "Rightsizing", "25k-100k"]) expect(message).toContain(value);
    for (const value of ["cf-turnstile-response", "RATE_LIMIT_HMAC_SECRET", "CF-Connecting-IP"]) expect(message).not.toContain(value);
  });

  it("fails closed when a binding/destination is missing or sending throws", async () => {
    expect(createConfiguredDelivery({ testMode: false }).type).toBe("disabled");
    const delivery = new CloudflareEmailDelivery({ send: vi.fn().mockRejectedValue(new Error("send failed")) });
    await expect(delivery.deliver(payload)).resolves.toEqual({ ok: false, retryable: true, reason: "temporary" });
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
});
