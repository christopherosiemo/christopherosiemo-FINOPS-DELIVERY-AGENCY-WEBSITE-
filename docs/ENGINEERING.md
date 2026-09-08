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
