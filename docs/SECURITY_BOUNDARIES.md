# Security boundaries

## Current boundary

The foundation serves public product content and a production-unreleased commercial enquiry boundary. It has no authentication, database, CMS, cloud-account connection, billing-data ingestion, analytics, or third-party runtime scripts.

No secrets belong in the repository or client bundle. `.env` files are ignored; `.env.example` documents only the provider-neutral disabled delivery state.

## Enquiry boundary

`/start` uses a Server Action with authoritative allow-list validation, a 64 KB action-body cap, explicit field limits, spend-range enum validation, newline normalisation, honeypot and minimum-completion-time checks, and Origin/Host protection. Unknown fields are discarded. Customer values remain structured plain text and are never rendered as HTML. The enhanced client boundary controls pending state and focus only; delivery remains server-owned.

Gate 7A has no authorised external destination. The disabled production adapter fails closed and cannot return a success state. Deterministic in-process adapters are available only when the test harness explicitly sets `ENQUIRY_TEST_MODE=1`; they make no network request. Production logging excludes all personal and customer prose and records only a request reference, timestamp, adapter category, outcome, and failure category.

A deployment-appropriate durable rate limiter, authorised delivery provider and credentials, approved privacy/legal terms, destination verification, secret ownership/rotation, retention/deletion policy, and operational response process are required before Gate 7B or public conversion launch.

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

Threat model, privacy policy, legal terms, security contact, production headers, detailed data-handling commitments, and the production access-policy artifact remain required before production qualification.
