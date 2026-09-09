# Conversion

This document is authoritative for the HKGpipi commercial enquiry experience on `/start`.

## Gate split and objective

The published conversion gate remains 70–78%. Its working split is:

- **70–75:** production conversion interface, server boundary, validation, and anti-abuse foundation.
- **75–78:** authorised delivery integration, end-to-end external verification, and independent conversion approval.

At 75%, the interface and server submission architecture are complete but production delivery is not connected. At 78%, a controlled end-to-end test enquiry has been delivered through an authorised production-equivalent integration and verified at its destination. At 100%, a genuine external prospect or customer—not the development team, staging, or automation—has completed the production conversion.

A website enquiry conversion occurs only when a valid submission is accepted by the server and successfully delivered to the authorised external destination. A view, button click, submit attempt, validation result, Playwright submission, developer submission, or staging submission is not a completed conversion. A verified enquiry is one for which the delivery adapter returned success and the authorised external destination confirmed receipt. This is still not equivalent to programme completion.

## Interface and qualification

`/start` is the single canonical commercial enquiry form. It asks only for:

- required `email`: Work email; browser email input, trimmed, maximum 254 characters;
- required `name`: Name; trimmed, maximum 100 characters;
- required `company`: Company; trimmed, maximum 160 characters;
- required `awsContext`: What should we know about your AWS estate?; 20–2,000 meaningful characters;
- required `priority`: What do you want to change?; 20–2,000 meaningful characters;
- optional structured `spendRange`: Prefer not to say, Under £25k, £25k–£100k, £100k–£500k, or £500k+.

Spend bands do not determine eligibility or price. The form does not collect phone number, budget, company size, referral source, AWS account IDs, credentials, IAM keys, passwords, access tokens, payment details, billing exports, security files, home address, or sensitive personal data. It warns visitors not to include credentials, secrets, or AWS access keys. Submitting is an enquiry; it neither creates an engagement nor authorises AWS access.

The accurate customer-facing privacy disclosure is: “We will use the information you submit to respond to this enquiry and assess whether a HKGpipi engagement is appropriate.” No mandatory marketing consent or newsletter opt-in is present. No `/privacy` link is shown because approved controller, legal-entity, retention, lawful-basis, address, DPO, and privacy-contact details do not yet exist. An approved privacy policy and legal disclosure are blockers for Gate 7B and public conversion launch. Until then, `/start` and `/contact` remain `noindex, nofollow` and the conversion system is production-unreleased.

## Submission architecture

The form posts to a Next.js Server Action and uses React action state only for pending-state and focus enhancement. Static page context is server-rendered. Native form submission remains available without JavaScript; no submitted value is placed in a URL. The Server Action is the untrusted boundary: it reads an explicit allow-list of fields, validates and normalises them, checks origin context, applies anti-abuse and rate-limit hooks, creates a request ID, and calls one delivery interface. Delivery credentials and implementation never enter client JavaScript.

`EnquiryDelivery.deliver(payload)` receives structured plain text and returns either `{ ok: true, externalId? }` or `{ ok: false, retryable, reason }`. The form has no knowledge of whether a later authorised adapter uses email, CRM, webhook, ticket, or persistence. Customer prose is trimmed and line endings are normalised; it is otherwise unchanged. Unknown fields are ignored and never forwarded. Submitted HTML is inert text. A future HTML presentation must escape it.

The provider-neutral environment contract begins with `ENQUIRY_DELIVERY_PROVIDER`. Gate 7A documents `disabled` only. Provider-specific variables and credentials must not be introduced until a provider is approved. `ENQUIRY_TEST_MODE=1` is a test-harness switch, not a deployment setting; it enables deterministic in-process success and failure adapters for automated/review environments. Production without an authorised configured adapter uses the disabled adapter, fails closed, never reports success, never sends externally, and tells the visitor delivery was not confirmed.

## Validation and anti-abuse

Server validation is authoritative. Browser `required`, type, minimum, and maximum attributes improve feedback but do not replace it. Email validation is deliberately syntactic: CR/LF is rejected, but consumer domains are allowed and DNS/MX lookups are not performed. Spend values are canonical enums; an unknown value is rejected. Body size is capped at 64 KB by Next.js and every field has an application maximum.

The low-risk Gate 7A anti-abuse foundation includes an off-screen honeypot removed from the keyboard order and an issued timestamp that rejects implausibly fast completion. These are heuristics, not identity proof. CAPTCHA, fingerprinting, IP intelligence, and external anti-abuse vendors are absent. A rate-limit interface exists with a deterministic Gate 7A allow hook; it is intentionally not described as production protection. A production-durable deployment-appropriate rate limiter is required for Gate 7B.

Next.js Server Actions compare Origin with Host/X-Forwarded-Host and reject mismatches. The action additionally rejects an explicitly mismatched origin. Missing Origin is left to the framework because some legitimate non-browser clients omit it; no brittle application CSRF token is added. The default action-ID and 64 KB body protections remain in force.

## Result and operational behavior

Success is rendered only after `EnquiryDelivery` returns `ok: true`, with “Enquiry received.” and “Thanks. We have what we need to review the context you sent.” The primary next action returns home and the secondary link reviews `/method`; there is no response-time promise or automatic redirect.

Delivery, anti-abuse, origin, or rate-limit failure renders “We could not send your enquiry.” and “Your information has not been confirmed as delivered. Please try again.” Entered fields are retained. Validation errors produce a linked summary, `aria-invalid`, and associated error text. Enhanced submissions focus the result; without JavaScript, the returned server content remains understandable. Pending enhancement changes the button to “Sending…”, disables repeat submission, and leaves the form intact.

A non-sensitive `enq-` request reference may be displayed. It is not an external delivery ID. Production diagnostics may contain only request ID, timestamp, delivery adapter category, outcome, and failure category. They must not contain email, name, company, AWS context, priority, or full payloads. A future email adapter must never put unsanitised customer input into From, Reply-To, or Subject headers; CR/LF-capable values must be rejected or safely encoded.

## Prohibited patterns and Gate 7B blockers

The experience must not claim instant response, response time, qualification, savings, booking, engagement creation, delivery, storage, or queuing unless true. It must not use deceptive defaults, forced marketing consent, false urgency, price discrimination by spend band, fabricated destinations, silent submission loss, or a client-only success state.

Gate 7B and 78% are blocked on all of the following:

- an authorised production delivery destination;
- approved provider credentials and configuration;
- a production-durable anti-abuse/rate-limit decision;
- an approved privacy policy and legal disclosure;
- controlled external end-to-end delivery verification and independent conversion approval.
