# Quality gates

Progress is evidence-based and cumulative. A percentage marks the highest fully passed gate, not effort spent or subjective confidence. Failed or missing evidence keeps the programme below that gate.

## 0–5 — Commercial truth

**Objective:** Establish accurate proposition, offers, terminology, claim boundaries, and known unknowns.

**Required evidence:** Approved product context; separation of estimated and verified savings; prices and timeframes traced to an authoritative source; verification unknowns recorded.

**Exit criteria:** Product and brand documents agree; no claim implies an unsubstantiated guarantee; primary and secondary CTAs are named.

**Prohibited shortcuts:** Invented benefits, customers, metrics, certifications, testimonials, guarantees, or verification mechanics.

## 5–12 — Engineering foundation

**Objective:** Create a maintainable, accessible, server-first application baseline and persistent repository context.

**Required evidence:** Reproducible pnpm install; strict TypeScript; lint, unit/component, E2E, and build tooling; passing homepage smoke test; CI; documented architecture and project rules; clean repository review.

**Exit criteria:** All foundation acceptance commands pass, runtime inspection finds no obvious error, CI needs no secret, and progress evidence is recorded.

**Prohibited shortcuts:** Disabled strict checks, skipped tests reported as passing, speculative dependencies, generated output, secrets, or a starter page presented as product design.

## 12–20 — Design primitives

**Objective:** Calibrate the distinctive MEASURED visual system before building full pages.

**Required evidence:** Reviewed colour and contrast system, type scale, spacing, grid, responsive behavior, border/radius hierarchy, focus states, motion rules, and representative evidence-dense primitives.

**Exit criteria:** Tokens are implemented and documented across target viewports; accessibility and visual review pass; Savings Ledger and Verification Line specifications are ready for later implementation.

**Prohibited shortcuts:** Generic UI-kit defaults, decorative gradients/blobs, imitation of another brand, colour-only meaning, or motion without reduced-motion behavior.

## 20–28 — Global shell

**Objective:** Deliver the production-quality navigation, footer, metadata, and cross-route behavior.

**Required evidence:** Responsive header/footer, keyboard and screen-reader review, active/focus states, metadata and social-sharing policy, legal-route plan, and cross-browser checks.

**Exit criteria:** Shell behaves consistently on supported devices, exposes no dead links, and meets accessibility/performance requirements.

**Prohibited shortcuts:** Pointer-only navigation, inaccessible menus, fake trust marks, generic placeholder links, or shipping the foundation shell unchanged.

## 28–45 — Homepage

**Objective:** Explain the category, proposition, operating chain, evidence model, and next action with production-quality content and design.

**Required evidence:** Approved information hierarchy and copy; responsive implementation; defined Savings Ledger/Verification Line treatment where appropriate; accessibility, performance, and content review.

**Exit criteria:** A qualified visitor can understand what is offered, how recommendations reach the bill, and the appropriate next step without misleading claims.

**Prohibited shortcuts:** Fake dashboards, fabricated proof, pricing-card templates, unapproved promises, stock imagery, or animation used to conceal weak hierarchy.

Internal evidence checkpoints within this published gate are:

- **28–38:** Homepage narrative and static production composition. The complete page must succeed without JavaScript-dependent presentation or motion.
- **38–43:** Signature interaction, motion, responsive refinement, and homepage engineering polish.
- **43–45:** Independent final homepage review and calibration.

These checkpoints do not alter the overall 28–45 gate or permit a higher value before its corresponding evidence exists.

## 45–60 — Revenue pages

**Objective:** Present each commercial offer and its boundaries clearly enough to support an informed buying decision.

**Required evidence:** Approved Savings Sprint, Implementation Sprint, and verified-savings model content; scope/exclusion detail; route-level metadata; conversion paths; legal/commercial review.

**Exit criteria:** Prices, deliverables, dependencies, timing, and verification caveats are consistent across pages and traceable to approved source material.

**Prohibited shortcuts:** Treating 30 days as an end-to-end guarantee, hiding exclusions, inventing outcomes, or creating pricing variants without authority.

Internal evidence checkpoints within this published gate are:

- **45–53:** Commercial-page narrative and production static composition.
- **53–57:** Commercial consistency, responsive refinement, and decision-support polish.
- **57–60:** Independent revenue-page approval.

These checkpoints do not alter the overall 45–60 gate or permit a higher value before its corresponding evidence exists.

## 60–70 — Trust

**Objective:** Provide verifiable evidence and transparent operating/security boundaries.

**Required evidence:** Approved methodology, team/company facts, security and data-handling disclosures, and genuine case evidence where permission and provenance exist.

**Exit criteria:** Every trust claim can be substantiated; evidence is accessible and current; gaps are stated plainly.

**Prohibited shortcuts:** Fabricated logos, customers, testimonials, certifications, metrics, case studies, or implied AWS endorsement.

Internal evidence checkpoints within this published gate are:

- **60–67:** Production Method, Verification, and Security narratives, including operating decisions, measurement definitions, access boundaries, and customer-controlled change authority.
- **67–70:** Independent trust/security consistency review, responsive optical review, and final approval.

These checkpoints do not alter the overall 60–70 gate or permit a higher value before its corresponding evidence exists.

## 70–78 — Conversion system

**Objective:** Create an accessible, secure, measurable route from intent to the agreed commercial next step.

**Required evidence:** Approved fields and qualification logic; validation/error states; spam controls; privacy/consent basis; delivery ownership; event definition; end-to-end tests.

**Exit criteria:** Submissions are reliably handled, recoverable, protected, measurable, and operable with keyboard and assistive technology.

**Prohibited shortcuts:** Collecting unnecessary sensitive data, silent failure, dark patterns, unavailable integrations, or declaring clicks as commercial conversions.

## 78–88 — Engineering polish

**Objective:** Remove systemic accessibility, performance, resilience, maintainability, and cross-browser defects.

**Required evidence:** Browser/device matrix, manual accessibility testing, performance profiles, failure-state tests, dependency review, observability plan, and resolved priority defects.

**Exit criteria:** Approved support matrix passes; critical paths remain functional under expected failure modes; no unresolved high-severity defect remains.

**Prohibited shortcuts:** Optimising only synthetic scores, suppressing errors, broad hydration, brittle animation, or deferring known critical defects.

## 88–94 — Acquisition

**Objective:** Make approved public content discoverable, shareable, attributable, and maintainable.

**Required evidence:** Technical SEO, structured-data review, sitemap/robots policy, social previews, content ownership, analytics/consent implementation, and campaign-link validation.

**Exit criteria:** Search and sharing surfaces describe pages accurately; measurement respects consent and data policy; acquisition routes lead to valid content.

**Prohibited shortcuts:** Keyword stuffing, fabricated structured data, misleading previews, invasive tracking, or unowned content programmes.

## 94–99 — Production qualification

**Objective:** Prove all controllable product, engineering, design, content, measurement, security, and operational criteria are release-ready.

**Required evidence:** Production-equivalent deployment; domain/TLS and security review; monitoring and rollback; legal approval; full regression evidence; content sign-off; conversion telemetry verification; incident ownership.

**Exit criteria:** All controllable launch criteria pass with evidence and accountable owners. **99% means all controllable product, engineering, design, content, measurement, and production criteria have passed.**

**Prohibited shortcuts:** Treating staging as production proof, open critical risks, untested rollback, unverifiable telemetry, or declaring 100% from internal testing.

## 100 — First verified real commercial conversion

**Objective:** Demonstrate that the production website supports the agreed real-world commercial outcome.

**Required evidence:** A genuine external prospect/customer completes the agreed commercial conversion event on the production website, and the event is verifiably recorded under the approved measurement definition.

**Exit criteria:** The external event and its provenance are confirmed by the accountable owner. **100% cannot be declared from internal testing alone.**

**Prohibited shortcuts:** Test submissions, employee activity, synthetic events, unverified leads, vanity clicks, or retrospective redefinition of the conversion event.
