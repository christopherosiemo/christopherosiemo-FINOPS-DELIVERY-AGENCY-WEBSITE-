"use server";

import { headers } from "next/headers";
import { createConfiguredDelivery } from "@/lib/enquiry/delivery";
import { isAllowedSubmissionOrigin, processEnquirySubmission } from "@/lib/enquiry/submission";
import type { EnquirySubmissionState } from "@/lib/enquiry/types";

export async function submitEnquiry(
  _previousState: EnquirySubmissionState,
  formData: FormData,
): Promise<EnquirySubmissionState> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const scenarioValue = formData.get("__deliveryScenario");
  const scenario = process.env.ENQUIRY_TEST_MODE === "1" && typeof scenarioValue === "string"
    ? scenarioValue
    : undefined;

  return processEnquirySubmission(formData, {
    createRequestId: process.env.ENQUIRY_TEST_MODE === "1" ? () => "enq-test000001" : undefined,
    delivery: createConfiguredDelivery(scenario),
    originAllowed: isAllowedSubmissionOrigin(requestHeaders.get("origin"), host),
  });
}
