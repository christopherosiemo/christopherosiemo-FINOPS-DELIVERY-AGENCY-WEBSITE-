# Security boundaries

## Current boundary

The foundation serves public, static product content. It has no authentication, database, CMS, cloud-account connection, billing-data ingestion, form submission, analytics, or third-party runtime scripts.

No secrets belong in the repository or client bundle. `.env` files are ignored; no `.env.example` exists because no environment variables are required at this gate.

## Future review required

Before any form, AWS access, billing data, customer evidence, analytics, or external service is added, define and review:

- data classification, minimisation, retention, and deletion;
- authentication, authorisation, and tenant isolation;
- secret ownership and rotation;
- input validation, abuse controls, and auditability;
- vendor and regional data-processing boundaries;
- incident response and disclosure requirements.

Threat model, privacy policy, legal terms, security contact, and production headers are **TBD** before production qualification.
