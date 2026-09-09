# Homepage

This document is the authoritative specification for the public homepage. Gate 4A establishes the complete narrative and static production composition; motion and signature interaction are not part of this gate.

## Visitor narrative and section order

The homepage is one continuous argument: HKGpipi finds economically meaningful AWS opportunities, validates and assigns them, produces the engineering change, works through customer controls, and verifies the result against billing data. The visitor then sees the bounded first engagement and its approved implementation routes.

The fixed order is:

1. Global header.
2. Hero and Savings Ledger.
3. Recommendation gap.
4. Six-stage method.
5. Remediation evidence.
6. Customer controls.
7. Verification.
8. Security boundary.
9. Engagement path.
10. Global footer.

## Approved public copy

### Hero

- Eyebrow: **CLOUD MARGIN RECOVERY**
- H1: **Turn AWS waste into verified savings.**
- Support: **We find the savings, produce the engineering changes, work through your existing approval process and verify the reduction on your AWS bill.**
- Primary action: **Start a Savings Sprint** → `/start`
- Secondary action: **See how verification works** → `/verification`
- Commercial/access line: **14-day Savings Sprint · £5,000 · tightly constrained read-only access**

### Recommendation gap

- Headline: **Recommendations aren't savings. Shipped changes are.**
- Support: **The value is lost between identifying an opportunity and getting a safe change into production. HKGpipi owns the path from discovery to measurement.**
- Illustrative state path: Opportunity → Validated → Assigned → Change ready → Approved → Deployed → Verified.

### Method

Headline: **One accountable path from opportunity to bill.**

1. **FIND** — Locate economically meaningful AWS savings opportunities.
2. **VALIDATE** — Check the opportunity against usage, commitments and engineering risk.
3. **ASSIGN** — Connect the saving to the responsible service, team and infrastructure.
4. **CHANGE** — Produce the remediation, IaC change, ticket or pull-request-ready work.
5. **APPROVE** — Move through the customer's existing engineering and deployment controls.
6. **VERIFY** — Measure the resulting reduction against the agreed billing baseline.

These six terms are HKGpipi's repeatable operating language; synonyms must not replace or extend the chain.

### Remediation

- Headline: **Not another recommendation. The change required to realise it.**
- Support: **A saving only becomes actionable when engineering can see what changes, where it changes and what risk it carries.**
- The illustrative specimen pairs accountable opportunity data with a semantic Terraform `pre`/`code` diff. It has no terminal chrome or client-side syntax highlighter.

### Customer control

- Headline: **Your infrastructure. Your controls.**
- Support: **Discovery begins with tightly constrained read-only AWS access. Engineering changes move through your existing repositories, reviews and deployment controls.**
- Conceptual path: Opportunity → Ticket / PR → CI → Review → Approval → Production.
- Control statement: **HKGpipi does not bypass engineering.**
- Directional action: **Review our security model** → `/security`.

### Verification

- Headline: **A recommendation is estimated. A saving is measured.**
- Support: **After deployment we watch billing data, establish the post-change result and report the verified annualised saving.**
- Conceptual equation: Baseline spend − post-change spend = verified saving.
- Caveat: **Final verification accounts for the agreed billing baseline and relevant workload changes.**

The static Verification Line is the narrative climax. It communicates estimate → reconciliation → measured result in text and structure, never as percentage completion. The complete commercial methodology remains to be approved.

### Security boundary

- Headline: **Read what we need. Change nothing without you.**
- Discovery: **Tightly constrained read-only AWS access.**
- Implementation: **Changes move through your existing repositories, approvals and deployment controls.**
- Directional action: **Review security** → `/security`.

### Engagement path

- Headline: **Find what is worth changing in 14 days.**
- First engagement: **14-Day AWS Savings Sprint — £5,000 upfront**. Purpose: **Find and validate what is worth changing.**
- After the Sprint, approved work may follow either **Implementation Sprint — £15,000** or **Outcome-based — 25% of verified savings**.
- Primary action: **Start a Savings Sprint** → `/start`.
- Secondary action: **View pricing** → `/pricing`.

The three amounts are a sequence with two implementation branches, not unrelated subscription plans. The Sprint remains the obvious first action and transitions quietly into the existing footer action.

## Evidence and illustrative-data policy

Every major claim is followed by mechanism, state, data, evidence, or a concrete next action. Illustrative operational and financial data must carry a visible **ILLUSTRATIVE** label and must never be described as a customer result, live account, actual saving, or case study.

The homepage Savings Ledger reuses the design-system primitive's semantic table and labelled-record rendering. Its title is **Savings Ledger**, its context is **Ranked by value, confidence and engineering risk**, and it retains four representative rows: RDS rightsizing (`£4,820 / mo`, Validated), NAT architecture (`£2,140 / mo`, Remediation ready), Idle EC2 (`£980 / mo`, Awaiting approval), and Unused EBS (`£360 / mo`, Verified). Fields remain Account / service, Owner, Expected saving, Confidence, Risk, and State. Verified is the only green success state.

The remediation specimen is visibly illustrative and contains RDS rightsizing, `£4,820 / mo`, High confidence, Low engineering risk, Platform ownership, 34 days utilisation, and `infra/prod/rds.tf:118`, beside the instance-class change from `db.r6g.4xlarge` to `db.r6g.2xlarge`.

The Verification Line is visibly illustrative and retains expected annualised saving `£184,000`, verified annualised saving `£176,420`, and variance `−£7,580 · −4.1%`.

## CTA hierarchy

The primary commercial action throughout the page is **Start a Savings Sprint**. Hero verification and security links explain mechanism; **View pricing** supports commercial comparison. Repeated footer action is intentional, but the engagement section must not become a competing oversized CTA block.

## Responsive narrative

- Below 768px, copy precedes evidence; the Ledger uses labelled records; the state, method, and approval paths become vertical; code overflow remains contained; CTAs stack only where width requires it.
- From 768px to 1279px, layouts use deliberate eight-column/tablet compositions rather than stretched mobile arrangements.
- From 1280px, the hero uses the 12-column grid with proposition and evidence in optically balanced adjacent regions; dense evidence remains subordinate to the proposition while visible above the fold.
- All meaning, illustrative labels, financial values, controls, and verification text remain present without hover, animation, or JavaScript.

## Prohibited claims and treatments

Do not publish customer logos or names, testimonials, case studies, customer results, saved-for-customers amounts, percentage-saved or customer-count claims, AWS partner claims, awards, certifications, analyst or press quotes, or review scores without genuine approved provenance. Do not imply autonomous remediation, one-click fixes, or AI-generated PRs. Do not describe “30-Day Cloud Margin Recovery” as an end-to-end promise. Do not imply detailed verification methodology is final.

The page must not use decorative gradients, blobs, stock or planet artwork, metallic or 3D identity treatment, fake screenshots, generic dashboards, feature-card collections, pricing-card templates, or motion to rescue weak static hierarchy.
