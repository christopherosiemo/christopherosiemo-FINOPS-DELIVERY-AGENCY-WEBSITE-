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
pnpm test:e2e
pnpm build
```

CI runs those checks on pull requests and pushes to `main`, using the pnpm cache. A substantial task must update `docs/PROGRESS.md` when gate status or evidence changes.

## Change discipline

Keep route-specific work close to routes, site-wide compositions in `src/components/site`, and add shared UI primitives only after reuse is real. Do not introduce secrets, unavailable CI services, or speculative integrations. Passing checks are necessary but do not substitute for product, accessibility, design, security, and content review.
