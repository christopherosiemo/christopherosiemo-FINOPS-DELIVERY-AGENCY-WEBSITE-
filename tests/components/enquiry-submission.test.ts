import { describe, expect, it, vi } from "vitest";
import type { EnquiryDelivery, EnquiryDeliveryResult } from "@/lib/enquiry/delivery";
import { DisabledEnquiryDelivery } from "@/lib/enquiry/delivery";
import {
  isAllowedSubmissionOrigin,
  processEnquirySubmission,
  type EnquiryRateLimit,
} from "@/lib/enquiry/submission";
import type { EnquiryPayload } from "@/lib/enquiry/types";
import { validateEnquiry } from "@/lib/enquiry/validation";

const now = new Date("2026-09-09T12:00:00.000Z");

function validForm(overrides: Record<string, string> = {}) {
  const values = {
    email: "  alex@example.test  ",
    name: "  Alex Engineer  ",
    company: "  Example Infrastructure Ltd  ",
    awsContext: "  A multi-account estate\r\nwith material RDS spend.  ",
    priority: "  Rightsizing is blocked\rby change ownership.  ",
    spendRange: "25k-100k",
    __issuedAt: String(now.getTime() - 2_000),
    website: "",
    ignored: "must not be forwarded",
    ...overrides,
  };
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

class CapturingDelivery implements EnquiryDelivery {
  readonly type = "capture";
  payloads: EnquiryPayload[] = [];

  constructor(private readonly result: EnquiryDeliveryResult) {}

  async deliver(payload: EnquiryPayload) {
    this.payloads.push(payload);
    return this.result;
  }
}

const fixedId = () => "enq-test000001";

describe("enquiry validation", () => {
  it("reports every required field on an empty submission", () => {
    const result = validateEnquiry(new FormData(), now.getTime());
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors)).toEqual(["email", "name", "company", "awsContext", "priority"]);
  });

  it("rejects invalid email, CR/LF abuse, invalid spend enums, and overlong values", () => {
    const invalidEmail = validateEnquiry(validForm({ email: "alex@example.test\r\nBcc: victim@example.test" }), now.getTime());
    expect(invalidEmail.ok || invalidEmail.errors.email).toBe("Enter a valid email address.");
    const whitespaceEmail = validateEnquiry(validForm({ email: "alex engineer@example.test" }), now.getTime());
    expect(whitespaceEmail.ok || whitespaceEmail.errors.email).toBe("Enter a valid email address.");

    const result = validateEnquiry(validForm({
      email: `${"a".repeat(245)}@example.test`,
      name: "a".repeat(101),
      company: "a".repeat(161),
      awsContext: "a".repeat(2_001),
      priority: "a".repeat(2_001),
      spendRange: "unapproved",
    }), now.getTime());
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors)).toEqual(["email", "name", "company", "awsContext", "priority", "spendRange"]);
  });

  it("requires meaningful AWS context and engineering priority", () => {
    const result = validateEnquiry(validForm({ awsContext: "too short", priority: "also short" }), now.getTime());
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toMatchObject({ awsContext: expect.any(String), priority: expect.any(String) });
  });

  it("normalises whitespace and prose line endings without transforming script-like text", () => {
    const result = validateEnquiry(validForm({ priority: "  <script>alert(1)</script>\r\n remains text  " }), now.getTime());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.values).toMatchObject({
        email: "alex@example.test",
        name: "Alex Engineer",
        company: "Example Infrastructure Ltd",
        awsContext: "A multi-account estate\nwith material RDS spend.",
        priority: "<script>alert(1)</script>\n remains text",
      });
    }
  });
});

describe("enquiry submission", () => {
  it("delivers only approved normalised fields and returns success only after adapter success", async () => {
    const delivery = new CapturingDelivery({ ok: true, externalId: "external-test" });
    const result = await processEnquirySubmission(validForm(), {
      delivery,
      now,
      createRequestId: fixedId,
      log: vi.fn(),
    });
    expect(result.status).toBe("success");
    expect(delivery.payloads).toEqual([{
      email: "alex@example.test",
      name: "Alex Engineer",
      company: "Example Infrastructure Ltd",
      awsContext: "A multi-account estate\nwith material RDS spend.",
      priority: "Rightsizing is blocked\nby change ownership.",
      spendRange: "25k-100k",
      requestId: "enq-test000001",
      receivedAt: now.toISOString(),
    }]);
    expect(delivery.payloads[0]).not.toHaveProperty("ignored");
  });

  it.each([
    ["retryable", { ok: false, retryable: true, reason: "temporary" } as const],
    ["permanent", { ok: false, retryable: false, reason: "rejected" } as const],
  ])("keeps values and reports a %s delivery failure", async (_kind, adapterResult) => {
    const result = await processEnquirySubmission(validForm(), {
      delivery: new CapturingDelivery(adapterResult), now, createRequestId: fixedId, log: vi.fn(),
    });
    expect(result).toMatchObject({ status: "delivery-failure", requestId: "enq-test000001", values: { email: "alex@example.test" } });
  });

  it("fails closed when production delivery is disabled", async () => {
    const result = await processEnquirySubmission(validForm(), {
      delivery: new DisabledEnquiryDelivery(), now, createRequestId: fixedId, log: vi.fn(),
    });
    expect(result.status).toBe("delivery-failure");
  });

  it.each([
    ["honeypot", { website: "https://bot.example" }],
    ["implausibly fast completion", { __issuedAt: String(now.getTime()) }],
  ])("does not deliver on %s", async (_reason, override) => {
    const delivery = new CapturingDelivery({ ok: true });
    const result = await processEnquirySubmission(validForm(override), {
      delivery, now, createRequestId: fixedId, log: vi.fn(),
    });
    expect(result.status).toBe("delivery-failure");
    expect(delivery.payloads).toHaveLength(0);
  });

  it("honours a rate-limit denial without calling delivery", async () => {
    const delivery = new CapturingDelivery({ ok: true });
    const rateLimit: EnquiryRateLimit = { check: vi.fn().mockResolvedValue({ allowed: false }) };
    const result = await processEnquirySubmission(validForm(), {
      delivery, rateLimit, now, createRequestId: fixedId, log: vi.fn(),
    });
    expect(result.status).toBe("delivery-failure");
    expect(delivery.payloads).toHaveLength(0);
  });

  it("emits only a safe structured diagnostic", async () => {
    const log = vi.fn();
    await processEnquirySubmission(validForm(), {
      delivery: new CapturingDelivery({ ok: true }), now, createRequestId: fixedId, log,
    });
    const serialised = JSON.stringify(log.mock.calls);
    expect(serialised).toContain("enq-test000001");
    for (const privateValue of ["alex@example.test", "Alex Engineer", "Example Infrastructure", "RDS", "Rightsizing"]) {
      expect(serialised).not.toContain(privateValue);
    }
  });
});

describe("submission origins", () => {
  it("accepts same-origin and absent origins but rejects mismatches and malformed values", () => {
    expect(isAllowedSubmissionOrigin("https://hkgpipi.com", "hkgpipi.com")).toBe(true);
    expect(isAllowedSubmissionOrigin(null, "hkgpipi.com")).toBe(true);
    expect(isAllowedSubmissionOrigin("https://attacker.example", "hkgpipi.com")).toBe(false);
    expect(isAllowedSubmissionOrigin("not a url", "hkgpipi.com")).toBe(false);
    expect(isAllowedSubmissionOrigin("https://hkgpipi.com", null)).toBe(false);
  });
});
