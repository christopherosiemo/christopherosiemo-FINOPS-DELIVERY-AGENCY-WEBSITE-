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

## Git completion requirements

- A coding task is not complete when changes are only committed locally.
- After completing implementation, run all relevant tests and validation checks.
- Review the final diff and confirm only intended changes are present.
- Commit completed work with a clear commit message, then push it normally to `origin/main`.
- Fetch from `origin` after pushing and verify local `main` and `origin/main` point to the exact same commit SHA.
- Confirm the working tree is clean and report the final commit SHA and synchronization status.
- Never report a task, milestone, or gate as complete until its completed commit is confirmed on `origin/main`.
- Never force-push, rebase, reset, amend existing commits, or rewrite history unless explicitly instructed.
- If a push fails or local and remote history have diverged, stop and explain the situation before attempting any destructive Git operation.

Required completion report:

```text
Tests: passed / failed
Commit: <full SHA>
Push: successful / failed
Local main: <SHA>
origin/main: <SHA>
Working tree: clean / dirty
Status: synchronized / not synchronized
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
