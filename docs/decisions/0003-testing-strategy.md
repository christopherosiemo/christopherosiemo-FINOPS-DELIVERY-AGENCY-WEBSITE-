# ADR 0003: Layered testing

**Status:** Accepted

## Context

The foundation needs fast feedback for components and browser-level confidence for critical accessibility and runtime behavior.

## Decision

Use Vitest with Testing Library and jsdom for unit/component tests, plus Playwright with Chromium for critical paths. CI runs lint, strict type checking, tests, E2E smoke coverage, and a production build.

## Consequences

Most behavior can be checked quickly, while browser tests remain limited to high-value flows. Accessibility still requires manual and specialist review beyond automated assertions.
