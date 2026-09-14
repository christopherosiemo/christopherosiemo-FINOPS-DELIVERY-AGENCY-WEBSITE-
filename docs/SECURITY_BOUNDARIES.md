# Security boundaries

## Current boundary

The site serves public product content and a production-unreleased commercial enquiry boundary. It has no authentication, CMS, cloud-account connection, billing-data ingestion, analytics, or non-essential tracking. Turnstile is the sole third-party browser script and exists only for form security.

No secrets belong in the repository or client bundle. `.env` files are ignored; `.env.example` documents only the provider-neutral disabled delivery state.

## Enquiry boundary

`/start` uses a Server Action with authoritative allow-list validation, a 64 KB action-body cap, explicit field limits, spend-range enum validation, newline normalisation, honeypot, Origin/Host protection, durable rate limiting, and Turnstile Siteverify. The retired minimum-completion-time heuristic does not reject fast legitimate submissions. Unknown fields are discarded. Customer values remain structured plain text and are never rendered as HTML.

Cloudflare's SQLite Durable Object stores attempt timestamps only. Raw addresses are HMAC-pseudonymised before object selection, never persisted or logged, and missing IP uses a shared protected bucket. The Email Service binding is restricted to the approved public sender and destination. Production logging excludes personal/customer prose, IP/HMAC, tokens, secrets, and the private forwarding address; it records request reference, timestamp, adapter, safe outcomes, and provider message ID when available.

Unexpected rate-limit, verification, delivery, or Server Action setup failures fail closed into the same truthful generic delivery-failure surface. The browser receives normalized entered values and a non-sensitive request reference, never an exception message, stack, provider detail, token, raw address, HMAC key, secret, or private destination. Durable Object transport and response-shape failures are logged only as `rate-limit-unavailable`; they are not misreported as allowed or as a user-exhausted rate limit.

Test adapters require the explicit test environment and cannot be activated in staging or production. The production Worker has dedicated secrets and a dedicated Turnstile widget, but remains publicly unreachable until custom-domain approval. Secret rotation ownership, cutover verification, and operational response remain required for live production.

## Browser response boundary

All routes set `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, and a Permissions Policy disabling camera, microphone, geolocation, payment, and USB. The framework disclosure header is disabled. Dynamic `/start` responses retain private/no-store behavior; static pages retain framework-managed shared caching; hashed Next assets retain immutable caching.

Production uses an enforceable static CSP with explicit self/data/blob allowances and only `https://challenges.cloudflare.com` as a browser third party. `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, and `frame-ancestors 'none'` narrow the boundary; wildcards and `unsafe-eval` are absent. The bounded `unsafe-inline` allowance supports Next hydration and generated styles. A strict nonce policy is not selected because Next.js 16 requires every protected page to render dynamically, disabling static optimization and normal CDN caching; vinext also cannot reliably classify the current routes. Production-mode browser tests instantiate Turnstile and collect CSP violations without submitting the form.

HSTS remains disabled throughout Gate 10B and requires separate Gate 10C authorization after the custom-domain certificate, HTTPS behavior, first-request HTTP redirect, and rollback route have passed independent verification.

Gate 8B revalidated the actual staging header matrix on the root, conversion, privacy, pricing, verification, security, and hard-404 responses. The approved nosniff, referrer, framing, and Permissions Policy fields are present; disclosure, CSP, and HSTS fields are absent as intended. The current vinext Worker emits `no-store, must-revalidate` for these HTML responses, while `/start` remains non-cacheable and hashed assets retain immutable caching. CSP and HSTS remain explicit production-domain requirements, not completed staging controls.

Unexpected failures and hard 404s render generic recovery surfaces. Exception messages, stacks, digests, provider detail, customer values, the destination secret, and other server secrets are not exposed to visitors.

## Engagement boundary

Discovery is intended to use tightly constrained read-only AWS access. The exact engagement-specific policy is reviewed before access is granted. It does not require unrestricted administrative access and does not give HKGpipi independent authority to deploy AWS changes.

Approved remediation stays within the customer's engineering and change-control path: customer repository or ticketing process, review, CI/checks, approval, and customer-controlled deployment. An explicit access model is required before production access is used.

Before access is granted, security reviewers must be able to examine the requested AWS permission scope, intended data categories, engineering-workflow boundary, and verification-access requirements.

Security certifications, retention commitments, data-residency terms, subprocessors, and formal assurance documents are public only after they are established and approved. None is currently implied by the Trust narrative.

## Future review required

Before any form, AWS access, billing data, customer evidence, analytics, or external service is added, define and review:

- data classification, minimisation, retention, and deletion;
- authentication, authorisation, and tenant isolation;
- secret ownership and rotation;
- input validation, abuse controls, and auditability;
- vendor and regional data-processing boundaries;
- incident response and disclosure requirements.

Threat model, legal terms, security contact, live-domain HSTS activation, detailed data-handling commitments, and the production access-policy artifact remain required before final production qualification. The static production CSP decision, public privacy policy, and staging response-header baseline now exist.
