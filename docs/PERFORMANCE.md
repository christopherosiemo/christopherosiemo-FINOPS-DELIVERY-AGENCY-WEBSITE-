# Performance

The site is designed for excellent Core Web Vitals and minimal client-side JavaScript. Performance regressions are bugs.

## Rules

- Render content on the server by default.
- Hydrate only where interaction requires it.
- Lazy-load non-critical media and use responsive images.
- Avoid unnecessary third-party scripts.
- Load fonts without avoidable layout instability.
- Decorative motion must not materially damage input responsiveness.
- Evaluate production output, not development mode, for release decisions.

## Design-system implications

Instrument Sans is loaded as a variable font and IBM Plex Mono as only the required 400 and 500 weights through `next/font/google`. Next.js self-hosts the generated assets, eliminating browser requests to Google and reducing avoidable layout instability. Both use `display: swap`.

The token system and specimen use static server components and CSS. No client boundary or runtime breakpoint logic was added. The motion specimen is CSS-only and resolves immediately for reduced-motion users. The single accessibility testing dependency is development-only and cannot enter the production client bundle.

CI builds before browser testing and runs Playwright against `next start`, so E2E covers the optimized production output without hiding build failures behind browser-test failures. Local functional E2E retains `next dev` for fast iteration.

## Budgets to lock

Final numeric budgets for JavaScript, CSS, media, fonts, LCP, INP, and CLS are **TBD** and must be approved during a later performance gate. Do not silently turn aspirational values into contractual targets.
