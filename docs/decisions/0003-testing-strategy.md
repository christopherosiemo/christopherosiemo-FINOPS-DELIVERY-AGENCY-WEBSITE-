# ADR 0003: Layered testing

**Status:** Accepted

## Context

The foundation needs fast feedback for components and browser-level confidence for critical accessibility and runtime behavior.

## Decision

Use Vitest with Testing Library and jsdom for unit/component tests, plus Playwright with Chromium for critical paths. CI runs lint, strict type checking, tests, a production build, and then browser verification against that built application.

**Gate 2A extension (2026-09-08):** Playwright also runs Axe against the public homepage and internal design specimen, checks keyboard/focus/reduced-motion/responsive behavior directly, and compares six deterministic visual baselines. Snapshot scope is intentionally limited to the design-system calibration route and two homepage review viewports.

**Gate 2B correction (2026-09-08):** Functional E2E and visual comparison are separate commands. Ubuntu with the pinned Playwright Chromium image is the canonical committed visual-baseline platform; Windows is not treated as an interchangeable renderer. Full-page tolerance is 0.2%, with four targeted component captures adding local sensitivity. Baseline updates are manual and human-reviewed. CI preserves the HTML report, actual/expected/diff images, traces, and other Playwright test results as short-lived failure artifacts.

## Consequences

Most behavior can be checked quickly, while browser tests remain limited to high-value flows. Accessibility still requires manual and specialist review beyond automated assertions.
