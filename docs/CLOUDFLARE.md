# Cloudflare delivery

## Runtime

The existing Next.js 16 application retains `pnpm dev` and `pnpm build`. Cloudflare Workers builds use vinext through `pnpm dev:cf`, `pnpm build:cf`, and `pnpm deploy:cf`; `worker.ts` delegates HTTP handling to vinext and exports the rate-limit Durable Object. The staging Worker is `hkgpipi-enquiry-staging` at `https://hkgpipi-enquiry-staging.charltonyalazima.workers.dev`. No production custom-domain route is configured by this gate.

The vinext 1.0.0-beta.9 compatibility check reports 92% compatibility: 10 supported checks, two partials, and zero unsupported issues. Its Google-font partial comes from the ignored historical `work/foundation` copy; the application runtime uses committed WOFF2 assets and makes no Google request. The App Router strict-mode partial reflects vinext's documented classification, while Next enables App Router strict mode by default.

## Binding contract

- `TURNSTILE_SITE_KEY`: public Worker variable; the staging value may appear in client HTML.
- `TURNSTILE_SECRET_KEY`: Worker secret.
- `TURNSTILE_EXPECTED_HOSTNAME`: exact environment hostname; staging is the workers.dev hostname and production is `hkgpipi.com`.
- `RATE_LIMIT_HMAC_SECRET`: Worker secret.
- `ENQUIRY_RATE_LIMITER`: SQLite-backed `EnquiryRateLimiter` Durable Object namespace.
- `ENQUIRY_EMAIL`: Email Service send binding restricted to sender and destination `enquiries@hkgpipi.com`.

Wrangler generates `worker-configuration.d.ts`; rerun `pnpm exec wrangler types` whenever bindings change. `.dev.vars.example` contains safe local placeholders only. Never commit secret values, Cloudflare credentials, or the forwarding Gmail address.

## Turnstile

The form uses a Managed widget with pre-clearance off and explicit rendering. Server-side Siteverify is mandatory and checks success, the action `savings_sprint_enquiry`, and the exact configured hostname. Missing, invalid, expired/duplicate, action-mismatched, hostname-mismatched, unavailable, and unconfigured results fail closed without revealing provider error codes. A failed/consumed token resets while legitimate form values remain.

Test rendering and test delivery/rate adapters require both `APP_ENVIRONMENT=test` and `ENQUIRY_TEST_MODE=1`. Configuration validation rejects that switch in staging and production.

## Durable rate limiting

The policy is five valid-shaped attempts per pseudonymous network key in 15 minutes. The Worker HMACs `CF-Connecting-IP` with `RATE_LIMIT_HMAC_SECRET` before selecting a Durable Object. A missing header enters a shared HMAC-derived fallback bucket and never bypasses protection. Each object transactionally stores only integer attempt timestamps in SQLite, deletes expired rows, and never stores an address, HMAC, enquiry field, or token. Wrangler's current declarative `exports` model provisions the new SQLite class; it is the documented successor to legacy migrations.

## Email delivery

`CloudflareEmailDelivery` sends structured plain text only after rate-limit and Turnstile success. The binding supplies its single configured destination so the underlying Gmail address is absent from source and runtime payload construction. Sender is `HKGpipi <enquiries@hkgpipi.com>`, Reply-To is the syntactically validated visitor email, and Subject is `HKGpipi Savings Sprint enquiry — <request ID>`. The body includes the reference, UTC receipt timestamp, and approved enquiry fields; it excludes IP data, HMAC values, Turnstile tokens, and secrets. Exceptions fail closed as `delivery-failure`.

## Staging and deployment

1. Authenticate interactively with `pnpm exec wrangler login`; never paste a token into chat or source.
2. Confirm the Managed Turnstile widget allows the exact staging hostname and has pre-clearance set to `no_clearance`.
3. Store `TURNSTILE_SECRET_KEY` and a random `RATE_LIMIT_HMAC_SECRET` with `wrangler secret put --env staging`.
4. Confirm Email Service has onboarded `hkgpipi.com`, permits `enquiries@hkgpipi.com` as sender, and can deliver to the configured enquiry alias, whose Email Routing destination remains private.
5. Run `pnpm install --frozen-lockfile`, the full validation suite, `pnpm build:cf`, and `pnpm exec vinext-cloudflare deploy --env staging`.
6. Verify `/`, `/start`, and `/privacy` return 200, the page remains `noindex, nofollow`, Turnstile renders, and no console or horizontal-overflow issue appears.
7. Submit exactly one synthetic Gate 7B enquiry through the real widget. Record UTC time, reference ID, and the Cloudflare message ID from safe Worker logs if available.
8. Ask the operator to confirm inbox arrival, subject, matching reference, body fields, Reply-To, and absence of IP/token/secret leakage. Cloudflare acceptance is not inbox proof.

Production qualification requires a separate production Turnstile widget/secret, HMAC secret, verified Email Service configuration, and explicit custom-domain routing approval. Do not point `hkgpipi.com` at this Worker during Gate 7B.
