import type { EnquiryRuntimeBindings } from "./bindings";

export const TURNSTILE_ACTION = "savings_sprint_enquiry";

export type ApplicationEnvironment = "local" | "test" | "staging" | "production";

export type EnquiryRuntimeConfig = {
  deliveryConfigured: boolean;
  environment: ApplicationEnvironment;
  expectedHostname?: string;
  siteKey?: string;
  testMode: boolean;
};

export const productionSubmissionDependencies = [
  "TURNSTILE_SITE_KEY",
  "TURNSTILE_SECRET_KEY",
  "TURNSTILE_EXPECTED_HOSTNAME",
  "RATE_LIMIT_HMAC_SECRET",
  "ENQUIRY_RATE_LIMITER",
  "ENQUIRY_EMAIL",
  "ENQUIRY_DESTINATION_ADDRESS",
] as const;

export function missingProductionSubmissionDependencies(bindings: EnquiryRuntimeBindings): string[] {
  return productionSubmissionDependencies.filter((name) => {
    const value = bindings[name];
    return typeof value === "string" ? value.trim().length === 0 : !value;
  });
}

export function readRuntimeConfig(bindings: EnquiryRuntimeBindings = process.env as unknown as EnquiryRuntimeBindings): EnquiryRuntimeConfig {
  const rawEnvironment = bindings.APP_ENVIRONMENT ?? "local";
  if (!["local", "test", "staging", "production"].includes(rawEnvironment)) {
    throw new Error("Invalid APP_ENVIRONMENT configuration.");
  }

  const environment = rawEnvironment as ApplicationEnvironment;
  const testMode = environment === "test" && process.env.ENQUIRY_TEST_MODE === "1";
  if ((environment === "staging" || environment === "production") && process.env.ENQUIRY_TEST_MODE === "1") {
    throw new Error("ENQUIRY_TEST_MODE is forbidden in staging and production.");
  }

  const expectedHostname = bindings.TURNSTILE_EXPECTED_HOSTNAME;
  if (environment === "production" && expectedHostname !== "hkgpipi.com") {
    throw new Error("Production Turnstile hostname must be hkgpipi.com.");
  }
  if (environment === "staging" && !expectedHostname) {
    throw new Error("Staging requires an explicit TURNSTILE_EXPECTED_HOSTNAME.");
  }

  const deliveryConfigured = Boolean(bindings.ENQUIRY_EMAIL && bindings.ENQUIRY_DESTINATION_ADDRESS?.trim());

  return { deliveryConfigured, environment, expectedHostname, siteKey: bindings.TURNSTILE_SITE_KEY, testMode };
}
