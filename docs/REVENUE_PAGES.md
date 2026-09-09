# Revenue pages

This document is authoritative for the Gate 5A commercial narrative and static decision experience on `/savings-sprint`, `/implementation`, and `/pricing`.

## Offer relationship

The commercial path is sequential, not a set of unrelated plans:

1. Begin with the **14-Day AWS Savings Sprint — £5,000 upfront**.
2. After the Sprint, approved work may follow either **Implementation Sprint — £15,000** or **Outcome-based implementation — 25% of verified savings**.

The £15,000 and 25% routes are alternatives. They are not a standard combined charge, recurring subscription, or complete contractual schedule.

## Approved commercial facts

The Savings Sprint ranks the AWS opportunities worth acting on and produces a specific implementation roadmap. Approved outputs are:

- savings opportunities ranked by monetary value, confidence, and engineering risk;
- Savings Plan and relevant commitment exposure;
- idle and waste analysis;
- expensive architecture patterns;
- specific remediation steps;
- IaC locations where identifiable;
- an implementation roadmap expressed through a ranked Savings Ledger.

The Sprint begins with tightly constrained read-only AWS access and does not independently deploy changes.

The Implementation Sprint turns approved opportunities into PRs, tickets, and/or configuration changes, works through the customer's existing engineering workflow to deployment, and establishes the realised-savings baseline. Customer repositories, reviews, CI, approvals, and deployment controls remain authoritative.

Under the alternative outcome-based model, the fee is 25% of savings that meet the agreed verification definition. The contractual verification basis must be agreed before outcome-based implementation begins. Thirty days is only an intended post-change verification context; it is not an end-to-end delivery promise.

## Route narratives and calls to action

### Savings Sprint

The page moves from price and access boundary through six stages: Access, Find, Validate, Map, Remediate, and Prioritise. It then explains review scope, the illustrative Savings Ledger, customer inputs, the no-deployment boundary, and the two later implementation routes. Approved Ledger items become the implementation backlog. The primary action is **Start a Savings Sprint** → `/start`; the secondary action is **See what happens next** → `/implementation`. Because the route already closes with implementation comparison and a direct start action, it suppresses only the global footer CTA while retaining footer navigation and identity.

### Implementation

The page starts from approved work, then follows Select, Prepare, Review, Deploy, Baseline, and Verify. It presents a conceptual evidence chain and compares only known distinctions between fixed and outcome-based implementation. The primary action remains **Start a Savings Sprint** → `/start`; security context links to `/security`.

### Pricing

The page makes the order explicit: £5,000 Sprint first, followed by either £15,000 fixed implementation or 25% of verified savings. It explains how verified savings affect pricing without adding a calculator or hypothetical cost example. Actions lead to `/start`, `/implementation`, and `/verification`.

## Illustrative evidence policy

The Savings Ledger specimen is visibly labelled **Illustrative** and demonstrates decision-quality fields only: Priority, Opportunity, Expected saving, Confidence, Engineering risk, Owner, and Remediation status. Its three synthetic decision records are RDS rightsizing, NAT architecture, and Idle EC2; their values and states explain the structure and are not evidence. Approved Ledger items—not every discovered item—become the implementation backlog. The specimen is not a real report, customer result, live account, benchmark, or case study. The implementation evidence chain is likewise conceptual and must not imply a live GitHub, Jira, CI, or repository integration.

## Known unknowns and deferred distinctions

Formal definitions for baselines, attribution, exclusions, timing, dispute handling, contract duration, scope limits, change counts, hours, payment timing, and outcome-based mechanics remain unapproved. The `/start` qualification form, legal terms, customer evidence, Trust, Company, and Resources content are deferred to later gates.

## Prohibited claims

Do not claim guaranteed savings, a 30-day end-to-end result, “no savings, no fee”, instant or autonomous remediation, AWS partnership, customer benchmarks, guaranteed ROI, a fixed implementation duration, fixed change counts, or fabricated urgency. Do not present £15,000 plus 25% as the standard model. Do not publish fake customers, testimonials, logos, evidence, screenshots, repository activity, or tool integrations.

## Static and indexing contract

All three routes are Server Components with CSS-only responsive composition. They add no route-specific client controller, motion layer, dependency, or JavaScript requirement. They retain `noindex, nofollow` until later commercial, legal, conversion, and independent-review gates approve indexing.
