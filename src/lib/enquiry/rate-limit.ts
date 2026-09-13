import type { EnquiryRateLimit, RateLimitDecision } from "./submission";

export const RATE_LIMIT_MAX_ATTEMPTS = 5;
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1_000;

type RateLimiterNamespace = {
  getByName(name: string): { fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> };
};

export async function pseudonymousNetworkKey(secret: string, ipAddress: string | undefined) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(ipAddress ?? "missing-ip"));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export class DurableObjectEnquiryRateLimit implements EnquiryRateLimit {
  constructor(
    private readonly namespace: RateLimiterNamespace,
    private readonly secret: string,
    private readonly ipAddress?: string,
  ) {}

  async check(input: { timestamp: string }): Promise<RateLimitDecision> {
    const key = await pseudonymousNetworkKey(this.secret, this.ipAddress);
    const stub = this.namespace.getByName(key);
    const response = await stub.fetch("https://rate-limit.internal/check", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ timestamp: input.timestamp }),
    });
    if (!response.ok) return { allowed: false };
    return await response.json<RateLimitDecision>();
  }
}
