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

## Budgets to lock

Final numeric budgets for JavaScript, CSS, media, fonts, LCP, INP, and CLS are **TBD** and must be approved during a later performance gate. Do not silently turn aspirational values into contractual targets.
