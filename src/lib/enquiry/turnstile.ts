import { TURNSTILE_ACTION } from "./runtime-config";

export type TurnstileOutcome =
  | "verified"
  | "missing-token"
  | "invalid-token"
  | "expired-or-duplicate"
  | "action-mismatch"
  | "hostname-mismatch"
  | "unavailable"
  | "secret-missing";

export interface TurnstileVerification {
  verify(token: string, remoteIp?: string): Promise<TurnstileOutcome>;
}

type SiteverifyResponse = {
  success?: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

export class CloudflareTurnstileVerification implements TurnstileVerification {
  constructor(
    private readonly secret: string | undefined,
    private readonly expectedHostname: string | undefined,
    private readonly fetcher: typeof fetch = fetch,
  ) {}

  async verify(token: string, remoteIp?: string): Promise<TurnstileOutcome> {
    if (!token) return "missing-token";
    if (!this.secret) return "secret-missing";
    if (!this.expectedHostname) return "hostname-mismatch";

    const body = new FormData();
    body.set("secret", this.secret);
    body.set("response", token);
    if (remoteIp) body.set("remoteip", remoteIp);

    try {
      const response = await this.fetcher("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body,
        signal: AbortSignal.timeout(8_000),
      });
      if (!response.ok) return "unavailable";
      const result = await response.json() as SiteverifyResponse;
      if (!result.success) {
        return result["error-codes"]?.some((code) => code === "timeout-or-duplicate")
          ? "expired-or-duplicate"
          : "invalid-token";
      }
      if (result.action !== TURNSTILE_ACTION) return "action-mismatch";
      if (result.hostname?.toLowerCase() !== this.expectedHostname.toLowerCase()) return "hostname-mismatch";
      return "verified";
    } catch {
      return "unavailable";
    }
  }
}

export class TestTurnstileVerification implements TurnstileVerification {
  async verify(token: string): Promise<TurnstileOutcome> {
    const outcomes: Record<string, TurnstileOutcome> = {
      "test-success": "verified",
      "test-expired": "expired-or-duplicate",
      "test-action-mismatch": "action-mismatch",
      "test-hostname-mismatch": "hostname-mismatch",
      "test-network-failure": "unavailable",
    };
    return token ? (outcomes[token] ?? "invalid-token") : "missing-token";
  }
}
