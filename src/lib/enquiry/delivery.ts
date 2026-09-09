import type { EnquiryPayload } from "./types";

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

export function createConfiguredDelivery(scenario?: string): EnquiryDelivery {
  const testMode = process.env.ENQUIRY_TEST_MODE === "1";
  if (testMode) {
    if (scenario === "success") return new TestEnquiryDelivery();
    if (scenario === "retryable-failure") {
      return new TestEnquiryDelivery({ ok: false, retryable: true, reason: "temporary" });
    }
    if (scenario === "permanent-failure") {
      return new TestEnquiryDelivery({ ok: false, retryable: false, reason: "rejected" });
    }
  }

  return new DisabledEnquiryDelivery();
}
