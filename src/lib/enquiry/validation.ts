import {
  spendRangeOptions,
  type EnquiryFieldErrors,
  type EnquiryValues,
  type SpendRange,
} from "./types";

const limits = {
  name: 100,
  company: 160,
  email: 254,
  awsContext: 2_000,
  priority: 2_000,
} as const;

const minimumProseLength = 20;
const minimumCompletionTimeMs = 1_000;
const spendRanges = new Set<string>(spendRangeOptions.map(({ value }) => value));

function readText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function normalizeProse(value: string) {
  return value.replace(/\r\n?/g, "\n").trim();
}

function normalizeSpendRange(value: string): SpendRange {
  return spendRanges.has(value) ? (value as SpendRange) : "prefer-not-to-say";
}

function hasValidEmailSyntax(value: string) {
  return !/[\r\n]/.test(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export type EnquiryValidationResult =
  | { ok: true; values: EnquiryValues; isLikelyBot: boolean }
  | { ok: false; values: EnquiryValues; errors: EnquiryFieldErrors };

export function validateEnquiry(formData: FormData, now = Date.now()): EnquiryValidationResult {
  const rawSpendRange = readText(formData, "spendRange");
  const values: EnquiryValues = {
    email: readText(formData, "email").trim(),
    name: readText(formData, "name").trim(),
    company: readText(formData, "company").trim(),
    awsContext: normalizeProse(readText(formData, "awsContext")),
    priority: normalizeProse(readText(formData, "priority")),
    spendRange: normalizeSpendRange(rawSpendRange),
  };
  const errors: EnquiryFieldErrors = {};

  if (!values.email) errors.email = "Enter your email address.";
  else if (values.email.length > limits.email || !hasValidEmailSyntax(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.name) errors.name = "Enter your name.";
  else if (values.name.length > limits.name) errors.name = `Use ${limits.name} characters or fewer.`;
  if (!values.company) errors.company = "Enter your company name.";
  else if (values.company.length > limits.company) errors.company = `Use ${limits.company} characters or fewer.`;
  if (!values.awsContext) errors.awsContext = "Describe your AWS estate.";
  else if (values.awsContext.length < minimumProseLength) errors.awsContext = "Add a little more context so we can understand your AWS estate.";
  else if (values.awsContext.length > limits.awsContext) errors.awsContext = `Use ${limits.awsContext.toLocaleString("en-GB")} characters or fewer.`;
  if (!values.priority) errors.priority = "Describe what you want to change.";
  else if (values.priority.length < minimumProseLength) errors.priority = "Add a little more detail about the engineering priority.";
  else if (values.priority.length > limits.priority) errors.priority = `Use ${limits.priority.toLocaleString("en-GB")} characters or fewer.`;
  if (rawSpendRange && !spendRanges.has(rawSpendRange)) errors.spendRange = "Choose an available spend range.";

  if (Object.keys(errors).length > 0) return { ok: false, values, errors };

  const issuedAt = Number(readText(formData, "__issuedAt"));
  const completedTooQuickly = !Number.isFinite(issuedAt) || issuedAt <= 0 || now - issuedAt < minimumCompletionTimeMs;
  const honeypotPopulated = readText(formData, "website").trim().length > 0;

  return { ok: true, values, isLikelyBot: completedTooQuickly || honeypotPopulated };
}

export const enquiryValidationLimits = limits;
export { hasValidEmailSyntax, normalizeProse };
