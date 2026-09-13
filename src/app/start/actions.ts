"use server";

import { headers } from "next/headers";
import { env } from "cloudflare:workers";
import { createConfiguredDelivery } from "@/lib/enquiry/delivery";
import type { EnquiryRuntimeBindings } from "@/lib/enquiry/bindings";
import { DurableObjectEnquiryRateLimit } from "@/lib/enquiry/rate-limit";
import { readRuntimeConfig } from "@/lib/enquiry/runtime-config";
import { isAllowedSubmissionOrigin, processEnquirySubmission, TestEnquiryRateLimit } from "@/lib/enquiry/submission";
import { CloudflareTurnstileVerification, TestTurnstileVerification } from "@/lib/enquiry/turnstile";
import type { EnquirySubmissionState } from "@/lib/enquiry/types";

export async function submitEnquiry(
  _previousState: EnquirySubmissionState,
  formData: FormData,
): Promise<EnquirySubmissionState> {
  const requestHeaders = await headers();
  const bindings = env as unknown as EnquiryRuntimeBindings;
  const config = readRuntimeConfig(bindings);
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const scenarioValue = formData.get("__deliveryScenario");
  const scenario = config.testMode && typeof scenarioValue === "string"
    ? scenarioValue
    : undefined;
  const token = formData.get("cf-turnstile-response");
  const remoteIp = requestHeaders.get("cf-connecting-ip") ?? undefined;
  const testRateLimited = config.testMode && scenario === "rate-limited";
  const rateLimit = config.testMode
    ? new TestEnquiryRateLimit(!testRateLimited)
    : bindings.ENQUIRY_RATE_LIMITER && bindings.RATE_LIMIT_HMAC_SECRET
      ? new DurableObjectEnquiryRateLimit(bindings.ENQUIRY_RATE_LIMITER, bindings.RATE_LIMIT_HMAC_SECRET, remoteIp)
      : new TestEnquiryRateLimit(false);
  const verification = config.testMode
    ? new TestTurnstileVerification()
    : new CloudflareTurnstileVerification(bindings.TURNSTILE_SECRET_KEY, config.expectedHostname);

  return processEnquirySubmission(formData, {
    createRequestId: config.testMode ? () => "enq-test000001" : undefined,
    delivery: createConfiguredDelivery({
      binding: bindings.ENQUIRY_EMAIL,
      scenario,
      testMode: config.testMode,
    }),
    originAllowed: isAllowedSubmissionOrigin(requestHeaders.get("origin"), host),
    rateLimit,
    remoteIp,
    turnstileToken: typeof token === "string" ? token : "",
    verification,
  });
}
