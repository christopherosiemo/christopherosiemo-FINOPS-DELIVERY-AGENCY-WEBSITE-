export const spendRangeOptions = [
  { value: "prefer-not-to-say", label: "Prefer not to say" },
  { value: "under-25k", label: "Under £25k" },
  { value: "25k-100k", label: "£25k–£100k" },
  { value: "100k-500k", label: "£100k–£500k" },
  { value: "500k-plus", label: "£500k+" },
] as const;

export type SpendRange = (typeof spendRangeOptions)[number]["value"];

export type EnquiryValues = {
  email: string;
  name: string;
  company: string;
  awsContext: string;
  priority: string;
  spendRange: SpendRange;
};

export type EnquiryPayload = EnquiryValues & {
  requestId: string;
  receivedAt: string;
};

export type EnquiryField = keyof EnquiryValues;
export type EnquiryFieldErrors = Partial<Record<EnquiryField, string>>;

export type EnquirySubmissionState = {
  status: "idle" | "validation-error" | "delivery-failure" | "success";
  values: EnquiryValues;
  errors: EnquiryFieldErrors;
  requestId?: string;
};

export const emptyEnquiryValues: EnquiryValues = {
  email: "",
  name: "",
  company: "",
  awsContext: "",
  priority: "",
  spendRange: "prefer-not-to-say",
};

export const initialEnquiryState: EnquirySubmissionState = {
  status: "idle",
  values: emptyEnquiryValues,
  errors: {},
};
