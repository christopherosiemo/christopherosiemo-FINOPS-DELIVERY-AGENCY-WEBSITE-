# Security boundaries

## Current boundary

The foundation serves public, static product content. It has no authentication, database, CMS, cloud-account connection, billing-data ingestion, form submission, analytics, or third-party runtime scripts.

No secrets belong in the repository or client bundle. `.env` files are ignored; no `.env.example` exists because no environment variables are required at this gate.

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
