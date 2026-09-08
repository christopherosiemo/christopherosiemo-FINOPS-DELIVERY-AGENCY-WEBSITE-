# Repository guidance

This is the public website for an engineering-led AWS cost-reduction company. The proposition is: “We turn AWS savings opportunities into verified reductions on your bill.” Authoritative product, brand, design, engineering, and gate definitions live in `docs/`; architectural structure and rationale live in `ARCHITECTURE.md`.

## Non-negotiables

- Use Next.js App Router, strict TypeScript, server components by default, and CSS custom properties as visual source of truth.
- Keep client JavaScript and dependencies minimal. Add abstractions only when repeated use justifies them.
- Never fabricate claims, guarantees, customers, testimonials, logos, certifications, metrics, or evidence.
- Consult `docs/BRAND.md` and `docs/DESIGN_SYSTEM.md` before visual or content changes.
- Maintain semantic HTML, keyboard access, visible focus, reduced-motion support, and the WCAG 2.2 AA target.
- Update `docs/PROGRESS.md` whenever a substantial task changes gate evidence or status.
- Do not declare work complete until `pnpm lint`, `pnpm typecheck`, `pnpm test`, relevant E2E tests, and `pnpm build` pass.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
