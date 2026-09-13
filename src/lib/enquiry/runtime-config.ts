import type { EnquiryRuntimeBindings } from "./bindings";

export const TURNSTILE_ACTION = "savings_sprint_enquiry";

export type ApplicationEnvironment = "local" | "test" | "staging" | "production";

export type EnquiryRuntimeConfig = {
  environment: ApplicationEnvironment;
  expectedHostname?: string;
  siteKey?: string;
  testMode: boolean;
};

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

  return { environment, expectedHostname, siteKey: bindings.TURNSTILE_SITE_KEY, testMode };
}
