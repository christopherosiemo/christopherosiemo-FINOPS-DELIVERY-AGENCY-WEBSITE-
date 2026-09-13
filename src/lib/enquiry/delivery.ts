import type { EnquiryPayload } from "./types";
import type { EnquiryEmailBinding } from "./bindings";

export type EnquiryDeliveryResult =
  | { ok: true; externalId?: string }
  | { ok: false; retryable: boolean; reason: "disabled" | "temporary" | "rejected" };

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
  ) {}

  async deliver(payload: EnquiryPayload): Promise<EnquiryDeliveryResult> {
    if (!this.binding) return { ok: false, retryable: true, reason: "disabled" };
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
        to: undefined,
        from: { name: "HKGpipi", email: "enquiries@hkgpipi.com" },
        replyTo: payload.email,
        subject,
        text,
      });
      return { ok: true, externalId: result.messageId };
    } catch {
      return { ok: false, retryable: true, reason: "temporary" };
    }
  }
}

type DeliveryConfiguration = {
  binding?: EnquiryEmailBinding;
  scenario?: string;
  testMode: boolean;
};

export function createConfiguredDelivery({ binding, scenario, testMode }: DeliveryConfiguration): EnquiryDelivery {
  if (testMode) {
    if (scenario === "success") return new TestEnquiryDelivery();
    if (scenario === "retryable-failure") {
      return new TestEnquiryDelivery({ ok: false, retryable: true, reason: "temporary" });
    }
    if (scenario === "permanent-failure") {
      return new TestEnquiryDelivery({ ok: false, retryable: false, reason: "rejected" });
    }
  }

  return binding
    ? new CloudflareEmailDelivery(binding)
    : new DisabledEnquiryDelivery();
}
