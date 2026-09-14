import { randomUUID } from "node:crypto";
import type { EnquiryDelivery, EnquiryDeliveryResult } from "./delivery";
import type { EnquiryPayload, EnquirySubmissionState } from "./types";
import { validateEnquiry } from "./validation";
import type { TurnstileOutcome, TurnstileVerification } from "./turnstile";

export type RateLimitDecision =
  | { allowed: true }
  | { allowed: false; reason?: "rate-limited"; retryAfterSeconds?: number }
  | { allowed: false; reason: "unavailable" };

export interface EnquiryRateLimit {
  check(input: { requestId: string; timestamp: string }): Promise<RateLimitDecision>;
}

export class Gate7aRateLimitHook implements EnquiryRateLimit {
  async check(): Promise<RateLimitDecision> {
    return { allowed: true };
  }
}

export class TestEnquiryRateLimit implements EnquiryRateLimit {
  constructor(private readonly allowed = true) {}
  async check(): Promise<RateLimitDecision> {
    return this.allowed ? { allowed: true } : { allowed: false };
  }
}

export type SubmissionDiagnostic = {
  requestId: string;
  timestamp: string;
  deliveryType: string;
  outcome: "success" | "failure";
  category: string;
  externalId?: string;
};

type SubmissionDependencies = {
  delivery: EnquiryDelivery;
  verification?: TurnstileVerification;
  turnstileToken?: string;
  remoteIp?: string;
  rateLimit?: EnquiryRateLimit;
  now?: Date;
  originAllowed?: boolean;
  log?: (diagnostic: SubmissionDiagnostic) => void;
  createRequestId?: () => string;
};

export function createEnquiryRequestId() {
  return `enq-${randomUUID().replaceAll("-", "").slice(0, 10)}`;
}

export function createFailClosedSubmissionState(
  formData: FormData,
  id = createEnquiryRequestId(),
): EnquirySubmissionState {
  return {
    status: "delivery-failure",
    values: validateEnquiry(formData).values,
    errors: {},
    requestId: id,
  };
}

function emitDiagnostic(
  log: (diagnostic: SubmissionDiagnostic) => void,
  diagnostic: SubmissionDiagnostic,
) {
  try {
    log(diagnostic);
  } catch {
    // Diagnostics must never change the truthful browser outcome.
  }
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
    verification = { verify: async () => "verified" },
    turnstileToken = "",
    remoteIp,
    rateLimit = new Gate7aRateLimitHook(),
    now = new Date(),
    originAllowed = true,
    log = console.info,
    createRequestId = createEnquiryRequestId,
  }:
    SubmissionDependencies,
): Promise<EnquirySubmissionState> {
  const validation = validateEnquiry(formData);
  if (!validation.ok) return { status: "validation-error", values: validation.values, errors: validation.errors };

  const id = createRequestId();
  const failedState: EnquirySubmissionState = {
    status: "delivery-failure",
    values: validation.values,
    errors: {},
    requestId: id,
  };
  if (!originAllowed || validation.honeypotPopulated) return failedState;

  const timestamp = now.toISOString();
  let rateDecision: RateLimitDecision;
  try {
    rateDecision = await rateLimit.check({ requestId: id, timestamp });
  } catch {
    emitDiagnostic(log, {
      requestId: id,
      timestamp,
      deliveryType: delivery.type,
      outcome: "failure",
      category: "rate-limit-unavailable",
    });
    return failedState;
  }
  if (!rateDecision.allowed) {
    const unavailable = rateDecision.reason === "unavailable";
    emitDiagnostic(log, {
      requestId: id,
      timestamp,
      deliveryType: delivery.type,
      outcome: "failure",
      category: unavailable ? "rate-limit-unavailable" : "rate-limited",
    });
    if (unavailable) return failedState;
    return { status: "rate-limited", values: validation.values, errors: {}, requestId: id };
  }

  let verificationOutcome: TurnstileOutcome;
  try {
    verificationOutcome = await verification.verify(turnstileToken, remoteIp);
  } catch {
    emitDiagnostic(log, {
      requestId: id,
      timestamp,
      deliveryType: delivery.type,
      outcome: "failure",
      category: "turnstile-unavailable",
    });
    return failedState;
  }
  if (verificationOutcome !== "verified") {
    emitDiagnostic(log, { requestId: id, timestamp, deliveryType: delivery.type, outcome: "failure", category: `turnstile-${verificationOutcome}` });
    return { status: "verification-failure", values: validation.values, errors: {}, requestId: id };
  }

  const payload: EnquiryPayload = { ...validation.values, requestId: id, receivedAt: timestamp };
  let result: EnquiryDeliveryResult;
  try {
    result = await delivery.deliver(payload);
  } catch {
    emitDiagnostic(log, {
      requestId: id,
      timestamp,
      deliveryType: delivery.type,
      outcome: "failure",
      category: "email-unavailable",
    });
    return failedState;
  }
  emitDiagnostic(log, {
    requestId: id,
    timestamp,
    deliveryType: delivery.type,
    outcome: result.ok ? "success" : "failure",
    category: result.ok ? "delivered" : result.providerCode ? `email-${result.providerCode}` : result.reason,
    externalId: result.ok ? result.externalId : undefined,
  });

  return result.ok
    ? { status: "success", values: validation.values, errors: {}, requestId: id }
    : failedState;
}
