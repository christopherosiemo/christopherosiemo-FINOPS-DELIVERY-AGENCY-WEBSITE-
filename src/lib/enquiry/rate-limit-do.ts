import { DurableObject } from "cloudflare:workers";
import { RATE_LIMIT_MAX_ATTEMPTS, RATE_LIMIT_WINDOW_MS } from "./rate-limit";

export class EnquiryRateLimiter extends DurableObject {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.ctx.storage.sql.exec(
      "CREATE TABLE IF NOT EXISTS attempts (attempted_at INTEGER NOT NULL)",
    );
  }

  async fetch(request: Request): Promise<Response> {
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
    const body = await request.json() as { timestamp?: string };
    const now = Date.parse(body.timestamp ?? "");
    if (!Number.isFinite(now)) return Response.json({ allowed: false }, { status: 400 });

    const decision = this.ctx.storage.transactionSync(() => {
      this.ctx.storage.sql.exec("DELETE FROM attempts WHERE attempted_at <= ?", now - RATE_LIMIT_WINDOW_MS);
      const rows = [...this.ctx.storage.sql.exec<{ total: number }>("SELECT COUNT(*) AS total FROM attempts")];
      const total = rows[0]?.total ?? 0;
      if (total >= RATE_LIMIT_MAX_ATTEMPTS) {
        return { allowed: false as const, retryAfterSeconds: Math.ceil(RATE_LIMIT_WINDOW_MS / 1_000) };
      }
      this.ctx.storage.sql.exec("INSERT INTO attempts (attempted_at) VALUES (?)", now);
      return { allowed: true as const };
    });

    return Response.json(decision);
  }
}
