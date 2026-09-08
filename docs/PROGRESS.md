# Progress

**Current value:** 28%

**Target for this checkpoint:** 28%

**Current gate:** Global Shell — complete

## Completed

- Commercial proposition, operating chain, offer boundaries, and prohibited claim patterns recorded.
- Production-grade Next.js App Router foundation with strict TypeScript, pnpm, ESLint, CSS tokens, controlled fonts, and a server-rendered semantic shell.
- Vitest component testing, Playwright smoke testing, and GitHub Actions CI established.
- Product, brand, design, accessibility, performance, analytics, security, architecture, decision, and quality-gate context recorded.
- Primitive and semantic token architecture implemented for colour, typography, spacing, layout, rhythm, borders, radii, motion, focus, and control sizing.
- Reusable action, field, status, Savings Ledger, and Verification Line design specimens implemented without client-side JavaScript.
- Internal `/design-system` calibration route added with `noindex, nofollow` and no public navigation entry.
- Responsive, accessibility, reduced-motion, overflow, runtime, and focused visual-regression coverage established.
- Gate 2B corrections strengthen secondary text, remove looping motion, separate the tablet introduction metadata, and make the Verification Line a variance-led reconciliation instrument.
- CI now builds before E2E, tests the built application through `next start`, compares against canonical Linux/Chromium visual baselines, and retains short-lived Playwright failure evidence.
- Independent visual review approved the Gate 2B captures and design-primitives correction pass.
- GitHub Actions run `34264386202` completed successfully against Gate 2B commit `6c8965a90de687ca81e648efff705605f5bdc859`.
- Gate 3A implemented the approved six-route primary navigation, dedicated `/start` action, structured footer, active-route treatment, and centralised identity configuration.
- Native modal navigation provides the responsive menu below 1280px with focus entry, containment, Escape/explicit close, focus return, reduced-motion handling, and safe-area spacing.
- Seven public route scaffolds plus the retained contact scaffold provide live, non-indexed targets with minimal approved copy and shared server-rendered structure.
- Root and scaffold metadata, sticky-header scroll accounting, shell documentation, direct interaction tests, and six independent-review captures are implemented.
- Independent Gate 3 optical review approved the shell architecture and requested a bounded identity calibration before final approval.
- The supplied `HKGpipi` identity replaces the retired working placeholder across header, dialog, footer, accessible naming, and root metadata without changing approved shell geometry.
- The mobile dialog now presents the visible label “Menu” and primary-ink route labels while retaining its meaningful accessible labels and active-route signal.
- Gate 3A shell architecture and Gate 3B HKGpipi identity calibration have been independently reviewed and approved.
- Desktop and mobile header and footer treatments are approved, together with the 390px and 768px modal navigation.
- The current typography-based HKGpipi identity treatment is approved for the Global Shell.

## In progress

- Homepage narrative and static production composition.

## Blocked

- None currently identified.

## Deferred

- Production Savings Ledger and Verification Line components and product behavior.
- Deeper route content architecture, verification methodology, conversion fields and qualification logic.
- Analytics, security integrations, production budgets, and production qualification.

## Evidence

- `pnpm install --frozen-lockfile` passed on 2026-09-08.
- `pnpm lint` passed on 2026-09-08 with zero warnings allowed.
- `pnpm typecheck` passed on 2026-09-08 under strict TypeScript.
- `pnpm test` passed on 2026-09-08: 1 component test.
- `pnpm test:e2e` passed on 2026-09-08: 1 Chromium smoke test covering response, one H1, primary navigation, working skip link, and captured runtime errors.
- `pnpm build` passed on 2026-09-08; `/` and `/contact` were statically prerendered.
- Independent local runtime inspection returned HTTP 200, the expected semantic landmarks/content, and no browser warning/error logs.
- Gate 2A pre-change baseline passed: lint, typecheck, 1 component test, 1 E2E test, and production build.
- Gate 2A implementation validation passed locally on 2026-09-08: 4 component tests and 17 Chromium E2E/visual checks.
- Gate 2A GitHub Actions run `34257216809` failed four Windows-to-Ubuntu visual comparisons: design-system 390 and 768, and homepage 390 and 1440; 13 other E2E checks passed and the build was skipped by the old ordering.
- Gate 2B pre-change local baseline passed on 2026-09-08: lint, typecheck, 4 component tests, 17 Chromium E2E/visual checks, and production build.
- Gate 2B correction validation passed locally on 2026-09-08: lint, typecheck, 5 component tests, 12 functional Chromium E2E checks, production build, and 7 canonical Linux visual tests covering 10 snapshots.
- Production-mode functional E2E passed locally against `next start`: 12 checks.
- The approved secondary text `#60625C` measures 5.65:1 on canvas and 6.18:1 on white.
- Axe reported no automatically detectable violations on `/` or `/design-system`.
- Required 390, 768, 1024, 1440, and 1728px responsive checks found no horizontal page overflow; 320px design-system and homepage checks also passed.
- Six full-page and four targeted deterministic Linux/Chromium visual baselines are stored under `tests/e2e/snapshots/visual.spec.ts/`.
- Gate 3A validation passed locally on 2026-09-08: lint, strict typecheck, 5 component tests, 36 Chromium functional E2E checks, and production build with all 11 current routes statically prerendered.
- Gate 3A canonical Linux/Chromium visual regression passed 13 tests covering 16 retained and new snapshots at the unchanged 0.002 full-page tolerance.
- Shell interaction coverage verifies all navigation targets return 200, scaffold robots policy, active-route semantics, modal focus behavior, reduced motion, sticky-header skip behavior, footer landmarks, Axe checks, and no horizontal overflow from 320px through 1728px.
- Six Gate 3A review PNGs cover desktop/mobile homepage tops, mobile/tablet open navigation, and desktop/mobile footer hierarchy. Independent review has not yet been claimed.
- Gate 3B preserves the approved breakpoint, navigation, dialog, footer, and macro-spacing architecture while calibrating the operator-provided identity and mobile label hierarchy.
- Gate 3B validation passed on 2026-09-08: frozen install, lint, strict typecheck, 5 component tests, production build, 36 functional Chromium checks in local and Linux production modes, and 13 canonical Linux visual checks covering 16 snapshots.
- Responsive inspection at 320, 390, 768, 1024, 1280, 1440, and 1728px found no horizontal overflow or identity/header/footer collisions; six Gate 3B review PNGs were produced for independent assessment.
- The independently approved Global Shell is recorded at commit `da66ccb622eb97de69f5017bf9ed020638016464`.
- GitHub Actions run `34281844179` completed successfully on that exact commit.

## Next gate

Build the homepage narrative and static production composition. Record 38% only after Gate 4A mechanical criteria pass; signature interaction and independent final homepage review remain later sub-gates.
