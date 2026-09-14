# Production operations

This is the authoritative HKGpipi runbook for the 94–99 production-qualification phase. Lower-level application and binding behavior remains defined in `ARCHITECTURE.md`, `CLOUDFLARE.md`, `CONVERSION.md`, and `SECURITY_BOUNDARIES.md`.

## Qualification boundaries

- **94–96:** prepare and deploy `hkgpipi-enquiry-production` with its own configuration, bindings, secrets, DNS inventory, security decision, cutover steps, and rollback steps. It must remain publicly unreachable: `workers_dev=false`, `preview_urls=false`, and no custom domain or route.
- **96–98:** only after explicit Gate 10B authorization, attach the apex custom domain, verify production, perform one controlled enquiry, and run the authorized search-activation sequence.
- **98–99:** independent whole-production qualification and release approval.
- **100:** one verified genuine external prospect/customer conversion. Operator, synthetic, test, or staging submissions do not qualify.

## Architecture and prerequisites

The application origin is the Cloudflare Worker `hkgpipi-enquiry-production`; the single canonical origin is `https://hkgpipi.com` and `APP_ENVIRONMENT=production`. The production environment must have no workers.dev or preview URL and no route until Gate 10B. Staging stays independent on its existing workers.dev hostname with its own secrets and Durable Object state.

Before cutover, require an exact-source green CI run, a clean and synchronized repository, the intended production Worker version, complete bindings and secrets, production Turnstile readiness, Email Sending readiness, a verified private destination, a recorded DNS baseline, a tested CSP, an active edge certificate, and a rehearsable rollback sequence.

## Production configuration inventory

| Kind | Name | Required state |
| --- | --- | --- |
| Variable | `APP_ENVIRONMENT` | `production` |
| Variable | `TURNSTILE_SITE_KEY` | Dedicated production public key |
| Variable | `TURNSTILE_EXPECTED_HOSTNAME` | `hkgpipi.com` |
| Secret | `TURNSTILE_SECRET_KEY` | Present; value never read back or recorded |
| Secret | `RATE_LIMIT_HMAC_SECRET` | Present; new and distinct from staging |
| Secret | `ENQUIRY_DESTINATION_ADDRESS` | Present; approved verified destination, value omitted |
| Binding | `ENQUIRY_RATE_LIMITER` | SQLite `EnquiryRateLimiter` Durable Object |
| Binding | `ENQUIRY_EMAIL` | Sender restricted to `enquiries@hkgpipi.com`; no committed destination |
| Binding | `CF_VERSION_METADATA` | Present |

The production Managed Turnstile widget allows only `hkgpipi.com`, uses action `savings_sprint_enquiry`, and has pre-clearance off. Missing Turnstile, rate-limit, Durable Object, email, destination, or exact-hostname configuration must fail closed. `ENQUIRY_TEST_MODE=1` and query-selected delivery scenarios are forbidden in production.

The production and staging Workers are separate named scripts. Their Durable Object namespaces and persisted SQLite state are therefore isolated by script/environment deployment identity, not merely by class name. Confirm the deployed binding for each script before cutover and create no production rate-limit state during Gate 10A.

## DNS and immutable email boundary

The recorded pre-cutover zone has no apex A, AAAA, or CNAME, no apex Worker Custom Domain or route, and no `www` record. The apex is not currently serving an application, so Gate 10B does not replace an existing site. The Google ownership TXT record remains present.

Web cutover must never add, edit, or remove MX, SPF, DKIM, DMARC, Email Routing destination/rule configuration, or Email Sending authentication. Compare the sanitized pre- and post-cutover record types, names, counts, and relevant service status; abort on any email-related difference. Preserve the Google verification TXT record.

## CSP decision

Gate 10A selects **B — enforceable static CSP ready; nonce hardening blocked by a verified compatibility and performance limitation**. Next.js 16 requires every nonce-protected page to be dynamically rendered, disabling static optimization and normal CDN caching. That would convert the currently static public narrative into per-request rendering and is not an acceptable unmeasured release change; vinext also cannot currently classify the affected routes reliably. The static production policy is therefore:

```text
default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
```

`unsafe-inline` is the bounded compatibility compromise required by Next hydration and generated styles. There is no wildcard, analytics origin, `unsafe-eval`, or additional browser third party. Production tests must cover the homepage, navigation, homepage motion, `/start`, Turnstile script loading without a form POST, Privacy, hard 404, fonts, metadata/OG routes, Server Action availability, retained response headers, and collected CSP violations. A blocked core path changes the decision to C and prohibits cutover.

Retain `nosniff`, strict-origin referrer handling, the approved Permissions Policy, `X-Frame-Options: DENY`, and the absent `X-Powered-By` header.

The static CSP is selected by build mode, not by the Worker runtime variable `APP_ENVIRONMENT`: every non-development Next/vinext build receives the same approved policy, while development remains exempt for HMR compatibility. The supported Cloudflare release path is `pnpm build:cf`, which asserts the exact policy in the generated `dist/server` artifact, followed by `pnpm deploy:cf --env production`, which deploys that already-qualified output without rebuilding it. CI must execute `pnpm test:production-cf-headers`, which boots the generated Worker rather than an ordinary `next start` artifact.

## Gate 10B cutover plan

1. Confirm every abort condition below is false and capture the current DNS and Worker routing state.
2. Confirm the exact production Worker version and source SHA, all three secret names, all bindings, and zero workers.dev/preview exposure.
3. Attach a Cloudflare Workers Custom Domain for the apex `hkgpipi.com`; do not add a broad Worker route.
4. Wait for the Cloudflare-managed edge certificate to become active. Verify TLS 1.2 minimum and TLS 1.3 where supported; do not buy or upload a certificate without a new requirement.
5. Verify HTTPS routes and the complete production CSP/security-header matrix before any form submission.
6. Enable Cloudflare's zone-level **Always Use HTTPS** edge setting and verify that `http://hkgpipi.com` returns a permanent redirect to `https://hkgpipi.com`; HSTS does not replace the first-request redirect.
7. `www` is currently absent and must remain absent unless support is separately authorized. If introduced later, configure it only as a permanent redirect to `https://hkgpipi.com`, never as duplicate canonical content.
8. Keep HSTS disabled throughout Gate 10B. Any future HSTS policy requires a separate Gate 10C authorization after the certificate, HTTPS redirect, and rollback path have been independently qualified.
9. Run production browser/runtime verification, then exactly one controlled production enquiry and independently confirm delivery. Do not use an enquiry to debug incomplete configuration.
10. Only after the live canonical site passes, execute the ordered search runbook: verify robots/sitemap/metadata, submit the sitemap to Google and Bing, and optionally request homepage indexing once. IndexNow remains unjustified for the current stable site.

## Rollback

1. Stop production verification and preserve timestamps, version IDs, response evidence, and the failing symptom without exposing customer or secret data.
2. Detach the apex custom domain or Worker route from `hkgpipi-enquiry-production`.
3. Restore the recorded previous apex web-routing state. For the current baseline this means no apex application-routing record; do not reconstruct it from memory.
4. Confirm apex traffic no longer reaches the production Worker and the production workers.dev and preview URLs remain disabled.
5. Confirm all MX, SPF, DKIM, DMARC, Email Routing, Email Sending, and Google ownership records are unchanged.
6. Confirm staging remains operational and non-indexable.
7. Record the rollback result and require a new exact-SHA green qualification before retrying cutover.

## Abort conditions

Do not start or continue Gate 10B if production secrets or bindings are incomplete; the production Turnstile widget, sender domain, or destination is unavailable; CSP blocks application behavior; certificate issuance or HTTPS fails; an unexpected apex service exists; the previous routing state or rollback action is unknown; email or Google-verification DNS differs; CI is red; the Worker version/source mismatches; workers.dev or preview exposure exists; or staging has regressed.

## Evidence and release decisions

Sanitized readiness evidence belongs in `outputs/gate-10a-review/`; cutover and rollback evidence belongs in `outputs/gate-10b-review/`. Both must omit secret values, private destinations, account/session identifiers, and verification tokens. At 96%, the production Worker, bindings, secrets, DNS and security decisions, cutover and rollback plans, and unreachable deployment are proven while public routing remains disconnected. At 98%, controlled cutover, production verification, one controlled enquiry, and authorized search activation have passed. Only independent review may award 99%. HKGpipi must not claim 100% before a genuine external conversion is verified.
