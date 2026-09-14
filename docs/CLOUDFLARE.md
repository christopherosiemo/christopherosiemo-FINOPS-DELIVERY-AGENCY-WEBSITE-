# Cloudflare delivery

## Runtime

The existing Next.js 16 application retains `pnpm dev` and `pnpm build`. Cloudflare Workers builds use vinext through `pnpm dev:cf`, `pnpm build:cf`, and `pnpm deploy:cf`; `worker.ts` delegates HTTP handling to vinext and exports the rate-limit Durable Object. The staging Worker is `hkgpipi-enquiry-staging` at `https://hkgpipi-enquiry-staging.charltonyalazima.workers.dev`. No production custom-domain route is configured by this gate.

The vinext 1.0.0-beta.9 compatibility check reports 94% compatibility: 14 supported checks, two partials, and zero unsupported issues. Its Google-font partial comes from the ignored historical `work/foundation` copy; the application runtime uses committed WOFF2 assets and makes no Google request. The App Router strict-mode partial reflects vinext's documented classification, while Next enables App Router strict mode by default.

## Binding contract

- `TURNSTILE_SITE_KEY`: public Worker variable; the staging value may appear in client HTML.
- `TURNSTILE_SECRET_KEY`: Worker secret.
- `TURNSTILE_EXPECTED_HOSTNAME`: exact environment hostname; staging is the workers.dev hostname and production is `hkgpipi.com`.
- `RATE_LIMIT_HMAC_SECRET`: Worker secret.
- `ENQUIRY_DESTINATION_ADDRESS`: Worker secret containing the private verified destination mailbox.
- `ENQUIRY_RATE_LIMITER`: SQLite-backed `EnquiryRateLimiter` Durable Object namespace.
- `ENQUIRY_EMAIL`: Email Service send binding restricted to sender `enquiries@hkgpipi.com`; it has no committed destination restriction.

Wrangler generates `worker-configuration.d.ts`; rerun `pnpm exec wrangler types` whenever bindings change. `.dev.vars.example` contains safe local placeholders only. Never commit secret values, Cloudflare credentials, or the forwarding Gmail address.

## Turnstile

The form uses a Managed widget with pre-clearance off and explicit rendering. Server-side Siteverify is mandatory and checks success, the action `savings_sprint_enquiry`, and the exact configured hostname. Missing, invalid, expired/duplicate, action-mismatched, hostname-mismatched, unavailable, and unconfigured results fail closed without revealing provider error codes. A failed/consumed token resets while legitimate form values remain.

Test rendering and test delivery/rate adapters require both `APP_ENVIRONMENT=test` and `ENQUIRY_TEST_MODE=1`. Configuration validation rejects that switch in staging and production.

## Durable rate limiting

The policy is five valid-shaped attempts per pseudonymous network key in 15 minutes. The Worker HMACs `CF-Connecting-IP` with `RATE_LIMIT_HMAC_SECRET` before selecting a Durable Object. A missing header enters a shared HMAC-derived fallback bucket and never bypasses protection. Each object transactionally stores only integer attempt timestamps in SQLite, deletes expired rows, and never stores an address, HMAC, enquiry field, or token. Wrangler's current declarative `exports` model provisions the new SQLite class; it is the documented successor to legacy migrations.

## Email delivery

`enquiries@hkgpipi.com` is the public inbound routing identity and outbound sender. The Worker sends directly to the private verified Email Routing destination supplied only by `ENQUIRY_DESTINATION_ADDRESS`; no recipient value comes from form data, URLs, headers, cookies, or client JavaScript. Cloudflare Email Service permits delivery only to eligible verified destinations on the account. Neither the secret nor its value is committed, rendered, or logged.

`CloudflareEmailDelivery` sends structured plain text only after rate-limit and Turnstile success and requires both the binding and destination secret. Sender is `HKGpipi <enquiries@hkgpipi.com>`, Reply-To is the syntactically validated visitor email, and Subject is `HKGpipi Savings Sprint enquiry — <request ID>`. The body includes the reference, UTC receipt timestamp, and approved enquiry fields; it excludes IP data, HMAC values, Turnstile tokens, destinations, and secrets. Missing configuration fails closed without calling the binding.

Provider exceptions are reduced to a narrow code allowlist. Delivery, rate-limit, daily-limit, internal, and unknown failures are treated as retryable; sender, recipient, validation, required-field, and header-policy failures are treated as non-retryable internally. Diagnostics record only `email-<safe code>` and never serialize the provider message, caught error, stack, destination, or enquiry data. Visitors continue to receive the generic `delivery-failure` response.

## Gate 7B.1 account and failure evidence

The operator confirms that Email Sending for `hkgpipi.com` is enabled, sending DNS is configured, Email preview is enabled, the `enquiries@hkgpipi.com` routing rule is active, and a verified destination is present. The destination value remains private.

Controlled references `enq-f80583652a` and `enq-e79dfa976e` passed client validation and displayed successful Turnstile verification, but the application returned `delivery-failure` and no message arrived. After the destination repair, controlled synthetic reference `enq-e2cb2d73bb` displayed “Enquiry received.” and the operator confirmed matching inbox delivery. That closed Gate 7B at 78%; it was not a genuine prospect/customer conversion.

## Staging response behavior

The application response-header baseline applies on the Worker as well as `next start`: the approved static CSP, nosniff, strict-origin referrer handling, denied framing, and a narrow Permissions Policy. `/start` must remain private/no-store; static pages and hashed assets retain runtime-managed caching. The same static CSP applies to staging and production Worker builds, but `Strict-Transport-Security` remains absent from the shared `workers.dev` hostname.

vinext 1.0.0-beta.9 does not apply its compiled `/:path*` header matcher to the root route, unlike Next. The Cloudflare build therefore emits an additional explicit `/` header rule while retaining the normal catch-all; the ordinary Next configuration retains only the catch-all and does not duplicate response fields.

Gate 8B read-only qualification confirmed staging version `e021e7a2-37f0-40eb-a39f-97515b4fad72`, deployed after source commit `f9bfa3f18923f380e2e08137cd7129033170b126`. The required routes and hard 404 return their expected statuses and headers. `/start` loads the Cloudflare Turnstile script with stable reserved geometry and no horizontal overflow; the isolated review browser did not instantiate a challenge iframe, which is not required by this gate and does not supersede the successful Gate 7B external-delivery proof. No form POST or email occurred.

Gate 9A read-only acquisition qualification deployed staging version `7fd6f06c-0368-443a-be07-e5f50091e1dc` from source commit `bf3649b941953e711ad4cd84451fdaa5edb8041a`. All public routes, robots, sitemap, social image, and icon resolved; an unknown route remained a hard 404. Explicit `APP_ENVIRONMENT=staging` produced `noindex, nofollow`, disallow-all robots, an empty sitemap, no JSON-LD, and production-origin canonicals without a workers.dev acquisition leak. No POST, email, production route, or DNS change occurred.

## Staging and deployment

1. Authenticate interactively with `pnpm exec wrangler login`; never paste a token into chat or source.
2. Confirm the Managed Turnstile widget allows the exact staging hostname and has pre-clearance set to `no_clearance`.
3. Store `TURNSTILE_SECRET_KEY`, a random `RATE_LIMIT_HMAC_SECRET`, and the private verified destination as `ENQUIRY_DESTINATION_ADDRESS` with `wrangler secret put --env staging`. Enter values interactively; never place them in command arguments or logs.
4. Confirm Email Service has onboarded `hkgpipi.com`, permits `enquiries@hkgpipi.com` as sender, and the secret destination remains verified. Email preview should be enabled for the next controlled verification.
5. Run `pnpm install --frozen-lockfile`, the full validation suite, `pnpm build:cf`, and `pnpm exec vinext-cloudflare deploy --env staging`.
6. Verify `/`, `/start`, and `/privacy` return 200, the page remains `noindex, nofollow`, Turnstile renders, and no console or horizontal-overflow issue appears.
7. Submit exactly one synthetic Gate 7B enquiry through the real widget. Record UTC time, reference ID, and the Cloudflare message ID from safe Worker logs if available.
8. Ask the operator to confirm inbox arrival, subject, matching reference, body fields, Reply-To, and absence of IP/token/secret leakage. Cloudflare acceptance is not inbox proof.

## Production readiness without routing

Gate 10A deploys the separate `hkgpipi-enquiry-production` script with `APP_ENVIRONMENT=production`, a production-only Managed Turnstile widget for `hkgpipi.com`, three production secrets, the sender-restricted Email binding, and the SQLite `ENQUIRY_RATE_LIMITER`. `workers_dev` and preview URLs are disabled and the deployed configuration has no route or Custom Domain, so Wrangler reports `No targets deployed`. Production and staging state are isolated by distinct Worker script deployments and Durable Object namespaces, not merely by the shared class name.

The production secret inventory is verified by names only: `TURNSTILE_SECRET_KEY`, `RATE_LIMIT_HMAC_SECRET`, and `ENQUIRY_DESTINATION_ADDRESS`. Values and the private destination are never read back or recorded. Production test mode and query-selected delivery scenarios remain forbidden, and missing critical bindings or exact-host configuration fails closed.

The DNS baseline contains no apex A, AAAA, CNAME, Worker route, or Custom Domain and no `www` record. Email-related MX, SPF, DKIM, DMARC, Email Routing, and Email Sending state is immutable during web cutover. The exact Gate 10B Custom Domain, TLS, redirect, HSTS, verification, and rollback sequence is authoritative in `PRODUCTION.md`. Do not point `hkgpipi.com` at the production Worker without explicit Gate 10B authorization.

Gate 10B's single controlled production submission did not render success or a handled failure, did not create an Email Sending Activity event, and did not arrive at the verified destination. Historical invocation detail was unavailable because production Workers Observability was disabled. The apex Custom Domain was removed, Always Use HTTPS was restored to its pre-cutover OFF state, and the route-free DNS, email, Google ownership, TLS 1.2, HSTS-disabled, and staging baselines were reverified. Search activation remains frozen.

Gate 10B.1 makes unexpected rate-limit, verification, and delivery dependency failures return the existing generic `delivery-failure` state with normalized user values and a safe request reference. Durable Object namespace/fetch failures, non-2xx responses, and malformed decisions are classified as `rate-limit-unavailable`, never as an allowed request or a false rate-limit denial. Production persisted Workers logs use 100% head sampling with query-string redaction and no persisted traces; application diagnostics remain limited to request ID, timestamp, delivery type, outcome, and a safe category.

Gate 10B.2 removes the release-pipeline dependency between compiled CSP and the runtime-only `APP_ENVIRONMENT` variable. `pnpm build:cf` now performs the vinext build and an exact generated-artifact CSP assertion. `pnpm test:production-cf-headers` starts that output with Wrangler, verifies the complete header boundary on representative routes and the hard 404, and dry-runs production targeting. `pnpm deploy:cf --env <environment>` runs the guarded build, requires a named `staging` or `production` target, merges that environment onto the same generated artifact, and deploys it with Wrangler without rebuilding; do not invoke `vinext-cloudflare deploy` directly as an alternative release path.
