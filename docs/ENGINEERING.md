# Engineering

## Baseline

- Next.js App Router, React, strict TypeScript, and pnpm.
- Server components by default; client components only for local interaction.
- No global state library or identity-defining UI kit.
- CSS custom properties are the source of visual truth.
- Dependencies are added only for demonstrated requirements.
- Unknown requirements are marked `TBD` rather than invented.

## Workflow

Install with `pnpm install`, run locally with `pnpm dev`, and validate with:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm test:engineering
pnpm test:qualification
pnpm test:smoke:cross-browser
pnpm test:performance
```

Functional E2E uses `next dev` locally for iteration. CI builds first and switches Playwright to `next start`, then runs functional E2E and visual comparison. This keeps production-build evidence independent from browser-test outcomes.

Ubuntu/Linux with Chromium from the pinned Playwright 1.63.0 image is the canonical visual-baseline platform. The six full-page review surfaces are retained and supplemented by four targeted high-signal captures for controls, financial typography, the Savings Ledger, and the Verification Line. Animations are frozen, data is deterministic, fonts are awaited, and the full-page differing-pixel allowance is 0.2% with a 0.2 per-pixel antialiasing threshold.

Refresh baselines only for an intentional, reviewed design-language change. On a machine with Docker, run the canonical Linux update from the repository root:

```powershell
docker run --rm -e CI=1 -v "${PWD}:/work" -v finops-visual-node-modules:/work/node_modules -w /work mcr.microsoft.com/playwright:v1.63.0-noble bash -lc "corepack enable && corepack prepare pnpm@11.19.0 --activate && pnpm install --frozen-lockfile && pnpm build && pnpm test:visual:update"
```

The manual `Generate visual baselines` GitHub Actions workflow provides the same Ubuntu snapshot generation when Docker is unavailable and uploads the results for review; it never commits them. CI uploads `playwright-report/` and `test-results/` for seven days when browser verification fails. A substantial task must update `docs/PROGRESS.md` when gate status or evidence changes.

## Change discipline

Keep route-specific work close to routes, site-wide compositions in `src/components/site`, and add shared UI primitives only after reuse is real. Do not introduce secrets, unavailable CI services, or speculative integrations. Passing checks are necessary but do not substitute for product, accessibility, design, security, and content review.

## Production resilience

The supported browser floor follows Next.js 16: Chrome, Edge, and Firefox 111+, and Safari 16.4+. CI runs a bounded critical-path smoke matrix in current Playwright Chromium, Firefox, and WebKit at 390px; broader responsive behavior remains covered by Chromium from 320px through 1728px. The matrix covers the public narrative, modal navigation, enquiry validation, native-select value retention, hard 404 behavior, keyboard activation, overflow, and runtime errors.

`not-found.tsx` returns a calm hard-404 surface with framework-generated `noindex`; `error.tsx` is the nearest recoverable client error boundary and exposes retry/home actions without rendering exception messages, digests, or stacks. A root `global-error.tsx` is intentionally absent: the root layout has no request-time failure source, and duplicating the document shell would add an unproved client boundary.

Server secrets and customer input must never enter HTML, browser JavaScript, URLs, or diagnostic messages. Browser checks inspect public documents, loaded scripts, console errors, third-party hosts, forced-colour behavior, WCAG text spacing, focus, and overflow. Production failures remain generic to visitors; safe request references and allowlisted provider outcomes remain the server-side diagnostic boundary.

The public client boundaries are intentionally limited to `SiteNavigation` (path state and native dialog), `HomeMotionController` (finite progressive enhancement), `EnquiryForm` (action state and accessible feedback), `TurnstileWidget` (the route-scoped provider lifecycle), and `error.tsx` (recoverable retry). Content, revenue, Trust, Privacy, 404, and layout components remain server-rendered. Cloudflare staging must preserve these response, cache, diagnostic, and test-mode boundaries under the vinext Worker runtime; Workers-specific unit tests and read-only staging smoke are release requirements.

## Dependency and runtime policy

Dependencies are exact-pinned and accepted only for a demonstrated requirement. `pnpm audit --prod --audit-level high` is the release audit; Gate 8A recorded no known production vulnerabilities. Next and vinext builds are both required because the latter remains a beta compatibility layer. Its current 94% report comprises 14 supported, two known partial classifications, and zero unsupported issues. No dependency was added for Gate 8A.

Gate 8A reaches 84% only when the full local matrix, canonical visuals, Cloudflare build, staging GET smoke, and CI are green on the synchronized commit. Gate 8B adds a repeatable whole-site qualification covering route/link/CTA integrity, semantics, commercial and privacy facts, dual-width Axe, keyboard and forced-colour behavior, 200% reflow equivalent, seven responsive widths, deterministic conversion states, no-JavaScript behavior, and secret/runtime checks. The bounded Chromium/Firefox/WebKit smoke now runs at both 390px and 1440px. Gate 8B evidence is prepared at 84%; only independent review may award 88%.

Gate 9A adds no dependency or client boundary. Its dedicated production-mode harness verifies unique metadata, canonical normalization, index/noindex policy, framework robots and sitemap responses, restricted server-rendered JSON-LD, share assets, hard-404 handling, private-data absence, and no browser-side analytics. The default test/staging harness independently protects fail-closed noindex behavior, while read-only staging checks prove that a production-built Worker does not activate acquisition without explicit `APP_ENVIRONMENT=production`.
