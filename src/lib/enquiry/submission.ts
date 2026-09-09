import { randomUUID } from "node:crypto";
import type { EnquiryDelivery } from "./delivery";
import type { EnquiryPayload, EnquirySubmissionState } from "./types";
import { validateEnquiry } from "./validation";

export type RateLimitDecision = { allowed: true } | { allowed: false; retryAfterSeconds?: number };

export interface EnquiryRateLimit {
  check(input: { requestId: string; timestamp: string }): Promise<RateLimitDecision>;
}

export class Gate7aRateLimitHook implements EnquiryRateLimit {
  async check(): Promise<RateLimitDecision> {
    return { allowed: true };
  }
}

type SubmissionDiagnostic = {
  requestId: string;
  timestamp: string;
  deliveryType: string;
  outcome: "success" | "failure";
  category: string;
};

type SubmissionDependencies = {
  delivery: EnquiryDelivery;
  rateLimit?: EnquiryRateLimit;
  now?: Date;
  originAllowed?: boolean;
  log?: (diagnostic: SubmissionDiagnostic) => void;
  createRequestId?: () => string;
};

function requestId() {
  return `enq-${randomUUID().replaceAll("-", "").slice(0, 10)}`;
}

export function isAllowedSubmissionOrigin(origin: string | null, host: string | null) {
  if (!origin) return true;
  if (!host) return false;
  try {
    return new URL(origin).host.toLowerCase() === host.split(",")[0].trim().toLowerCase();
  } catch {
    return false;
  }
}

export async function processEnquirySubmission(
  formData: FormData,
  {
    delivery,
    rateLimit = new Gate7aRateLimitHook(),
    now = new Date(),
    originAllowed = true,
    log = console.info,
    createRequestId = requestId,
  }:
    SubmissionDependencies,
): Promise<EnquirySubmissionState> {
  const validation = validateEnquiry(formData, now.getTime());
  if (!validation.ok) return { status: "validation-error", values: validation.values, errors: validation.errors };

  const id = createRequestId();
  const failedState: EnquirySubmissionState = {
    status: "delivery-failure",
    values: validation.values,
    errors: {},
    requestId: id,
  };
  if (!originAllowed || validation.isLikelyBot) return failedState;

  const timestamp = now.toISOString();
  const rateDecision = await rateLimit.check({ requestId: id, timestamp });
  if (!rateDecision.allowed) {
    log({ requestId: id, timestamp, deliveryType: delivery.type, outcome: "failure", category: "rate-limited" });
    return failedState;
  }

  const payload: EnquiryPayload = { ...validation.values, requestId: id, receivedAt: timestamp };
  const result = await delivery.deliver(payload);
  log({
    requestId: id,
    timestamp,
    deliveryType: delivery.type,
    outcome: result.ok ? "success" : "failure",
    category: result.ok ? "delivered" : result.reason,
  });

  return result.ok
    ? { status: "success", values: validation.values, errors: {}, requestId: id }
    : failedState;
}
