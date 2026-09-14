import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createConfiguredDelivery } from "@/lib/enquiry/delivery";
import { missingProductionSubmissionDependencies, readRuntimeConfig } from "@/lib/enquiry/runtime-config";
import { CloudflareTurnstileVerification } from "@/lib/enquiry/turnstile";
import { productionContentSecurityPolicy } from "@/config/security-headers";

afterEach(() => vi.unstubAllEnvs());

describe("production Worker configuration", () => {
  const config = JSON.parse(readFileSync("wrangler.jsonc", "utf8"));
  const production = config.env.production;
  const staging = config.env.staging;

  it("keeps production unreachable while leaving staging on workers.dev", () => {
    expect(production.name).toBe("hkgpipi-enquiry-production");
    expect(production.workers_dev).toBe(false);
    expect(production.preview_urls).toBe(false);
    expect(production).not.toHaveProperty("routes");
    expect(production).not.toHaveProperty("route");
    expect(staging.workers_dev).toBeUndefined();
    expect(staging.preview_urls).toBeUndefined();
  });

  it("does not inherit the staging hostname or site key", () => {
    expect(production.vars.APP_ENVIRONMENT).toBe("production");
    expect(production.vars.TURNSTILE_EXPECTED_HOSTNAME).toBe("hkgpipi.com");
    expect(production.vars.TURNSTILE_SITE_KEY).not.toBe(staging.vars.TURNSTILE_SITE_KEY);
    expect(production.vars.TURNSTILE_EXPECTED_HOSTNAME).not.toBe(staging.vars.TURNSTILE_EXPECTED_HOSTNAME);
  });

  it("retains isolated SQLite Durable Object and sender-restricted email bindings", () => {
    expect(config.exports.EnquiryRateLimiter).toEqual({ type: "durable-object", storage: "sqlite" });
    expect(production.durable_objects.bindings).toEqual([
      { name: "ENQUIRY_RATE_LIMITER", class_name: "EnquiryRateLimiter" },
    ]);
    expect(production.send_email).toEqual([
      { name: "ENQUIRY_EMAIL", allowed_sender_addresses: ["enquiries@hkgpipi.com"] },
    ]);
    expect(JSON.stringify(config)).not.toContain("gmail.com");
  });
});

describe("production fail-closed boundaries", () => {
  it("identifies every missing critical production dependency", () => {
    expect(missingProductionSubmissionDependencies({})).toEqual([
      "TURNSTILE_SITE_KEY",
      "TURNSTILE_SECRET_KEY",
      "TURNSTILE_EXPECTED_HOSTNAME",
      "RATE_LIMIT_HMAC_SECRET",
      "ENQUIRY_RATE_LIMITER",
      "ENQUIRY_EMAIL",
      "ENQUIRY_DESTINATION_ADDRESS",
    ]);
    expect(missingProductionSubmissionDependencies({
      TURNSTILE_SITE_KEY: "site-key",
      TURNSTILE_SECRET_KEY: "secret",
      TURNSTILE_EXPECTED_HOSTNAME: "hkgpipi.com",
      RATE_LIMIT_HMAC_SECRET: "rate-secret",
      ENQUIRY_RATE_LIMITER: {} as DurableObjectNamespace,
      ENQUIRY_EMAIL: { send: vi.fn() },
      ENQUIRY_DESTINATION_ADDRESS: "private@example.test",
    })).toEqual([]);
  });

  it("rejects absent or mismatched production hostnames", () => {
    expect(() => readRuntimeConfig({ APP_ENVIRONMENT: "production" })).toThrow(/hkgpipi.com/);
    expect(() => readRuntimeConfig({
      APP_ENVIRONMENT: "production",
      TURNSTILE_EXPECTED_HOSTNAME: "www.hkgpipi.com",
    })).toThrow(/hkgpipi.com/);
  });

  it("cannot activate test delivery from production scenarios", () => {
    vi.stubEnv("ENQUIRY_TEST_MODE", "0");
    const config = readRuntimeConfig({
      APP_ENVIRONMENT: "production",
      TURNSTILE_EXPECTED_HOSTNAME: "hkgpipi.com",
    });
    for (const scenario of ["success", "retryable-failure", "permanent-failure"]) {
      expect(createConfiguredDelivery({ scenario, testMode: config.testMode }).type).toBe("disabled");
    }
  });

  it("fails Turnstile closed without its server secret", async () => {
    const verify = new CloudflareTurnstileVerification(undefined, "hkgpipi.com", vi.fn());
    await expect(verify.verify("synthetic-token")).resolves.toBe("secret-missing");
  });

  it("requires both the email binding and destination secret", () => {
    expect(createConfiguredDelivery({ testMode: false }).type).toBe("disabled");
    expect(createConfiguredDelivery({ binding: { send: vi.fn() }, testMode: false }).type).toBe("disabled");
    expect(createConfiguredDelivery({ destinationAddress: "private@example.test", testMode: false }).type).toBe("disabled");
  });
});

describe("production CSP", () => {
  it("is bounded to self and Turnstile without wildcards or unsafe-eval", () => {
    expect(productionContentSecurityPolicy).toContain("script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com");
    expect(productionContentSecurityPolicy).toContain("frame-src https://challenges.cloudflare.com");
    expect(productionContentSecurityPolicy).toContain("connect-src 'self' https://challenges.cloudflare.com");
    expect(productionContentSecurityPolicy).not.toContain("unsafe-eval");
    expect(productionContentSecurityPolicy).not.toMatch(/(?:^|\s)\*(?:;|\s|$)/);
  });
});
