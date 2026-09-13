import type { EnquiryPayload } from "./types";
import type { EnquiryEmailBinding } from "./bindings";

export type EnquiryDeliveryResult =
  | { ok: true; externalId?: string }
  | {
      ok: false;
      retryable: boolean;
      reason: "disabled" | "temporary" | "rejected";
      providerCode?: SafeEmailProviderCode;
    };

export const safeEmailProviderCodes = [
  "E_VALIDATION_ERROR",
  "E_FIELD_MISSING",
  "E_SENDER_NOT_VERIFIED",
  "E_RECIPIENT_NOT_ALLOWED",
  "E_RECIPIENT_SUPPRESSED",
  "E_SENDER_DOMAIN_NOT_AVAILABLE",
  "E_DELIVERY_FAILED",
  "E_RATE_LIMIT_EXCEEDED",
  "E_DAILY_LIMIT_EXCEEDED",
  "E_INTERNAL_SERVER_ERROR",
  "E_HEADER_NOT_ALLOWED",
  "E_HEADER_USE_API_FIELD",
  "E_HEADER_VALUE_INVALID",
] as const;

export type SafeEmailProviderCode = (typeof safeEmailProviderCodes)[number] | "E_UNKNOWN";

const retryableEmailProviderCodes = new Set<SafeEmailProviderCode>([
  "E_DELIVERY_FAILED",
  "E_RATE_LIMIT_EXCEEDED",
  "E_DAILY_LIMIT_EXCEEDED",
  "E_INTERNAL_SERVER_ERROR",
  "E_UNKNOWN",
]);

export function classifyEmailProviderError(error: unknown): SafeEmailProviderCode {
  try {
    const code = typeof error === "object" && error !== null && "code" in error
      ? (error as { code?: unknown }).code
      : undefined;
    return typeof code === "string" && (safeEmailProviderCodes as readonly string[]).includes(code)
      ? code as SafeEmailProviderCode
      : "E_UNKNOWN";
  } catch {
    return "E_UNKNOWN";
  }
}

export interface EnquiryDelivery {
  readonly type: string;
  deliver(payload: EnquiryPayload): Promise<EnquiryDeliveryResult>;
}

export class DisabledEnquiryDelivery implements EnquiryDelivery {
  readonly type = "disabled";

  async deliver(): Promise<EnquiryDeliveryResult> {
    return { ok: false, retryable: true, reason: "disabled" };
  }
}

export class TestEnquiryDelivery implements EnquiryDelivery {
  readonly type = "test";

  constructor(private readonly result: EnquiryDeliveryResult = { ok: true, externalId: "test-delivery" }) {}

  async deliver(): Promise<EnquiryDeliveryResult> {
    await new Promise((resolve) => setTimeout(resolve, 120));
    return this.result;
  }
}

export class CloudflareEmailDelivery implements EnquiryDelivery {
  readonly type = "cloudflare-email";

  constructor(
    private readonly binding: EnquiryEmailBinding | undefined,
    private readonly destinationAddress: string | undefined,
  ) {}

  async deliver(payload: EnquiryPayload): Promise<EnquiryDeliveryResult> {
    const destinationAddress = this.destinationAddress?.trim();
    if (!this.binding || !destinationAddress) return { ok: false, retryable: true, reason: "disabled" };
    const subject = `HKGpipi Savings Sprint enquiry — ${payload.requestId}`;
    const text = [
      "HKGpipi Savings Sprint enquiry",
      "",
      `Reference ID: ${payload.requestId}`,
      `Received timestamp: ${payload.receivedAt}`,
      "",
      `Name: ${payload.name}`,
      `Work email: ${payload.email}`,
      `Company: ${payload.company}`,
      `Spend range: ${payload.spendRange}`,
      "",
      "AWS context:",
      payload.awsContext,
      "",
      "Engineering priority:",
      payload.priority,
    ].join("\n");

    try {
      const result = await this.binding.send({
        to: destinationAddress,
        from: { name: "HKGpipi", email: "enquiries@hkgpipi.com" },
        replyTo: payload.email,
        subject,
        text,
      });
      return { ok: true, externalId: result.messageId };
    } catch (error: unknown) {
      const providerCode = classifyEmailProviderError(error);
      const retryable = retryableEmailProviderCodes.has(providerCode);
      return { ok: false, retryable, reason: retryable ? "temporary" : "rejected", providerCode };
    }
  }
}

type DeliveryConfiguration = {
  binding?: EnquiryEmailBinding;
  destinationAddress?: string;
  scenario?: string;
  testMode: boolean;
};

export function createConfiguredDelivery({ binding, destinationAddress, scenario, testMode }: DeliveryConfiguration): EnquiryDelivery {
  if (testMode) {
    if (scenario === "success") return new TestEnquiryDelivery();
    if (scenario === "retryable-failure") {
      return new TestEnquiryDelivery({ ok: false, retryable: true, reason: "temporary" });
    }
    if (scenario === "permanent-failure") {
      return new TestEnquiryDelivery({ ok: false, retryable: false, reason: "rejected" });
    }
  }

  return binding && destinationAddress?.trim()
    ? new CloudflareEmailDelivery(binding, destinationAddress)
    : new DisabledEnquiryDelivery();
}
