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

## Global-shell implications

The header frame, footer, site configuration, metadata, and route scaffolds are server-rendered. Client JavaScript is limited to one local `SiteNavigation` boundary for current-path matching and native-dialog control. The shell adds no third-party dependency, icon package, animation runtime, global state, scroll listener, or route-transition code. The production build confirms every current route is statically prerendered; Next.js 16.3.4 does not emit route-level client-byte totals in its standard build table, so no unmeasured bundle-size claim is recorded.

## Homepage implications

Gate 4A adds no homepage client boundary, runtime dependency, image, animation, chart, syntax highlighter, observer, carousel, or state library. The narrative, Ledger records, Terraform diff, flow semantics, Verification Line, and commercial path render in the initial static HTML. CSS media queries provide all responsive composition changes. The existing `SiteNavigation` remains the only shell client boundary; production build output is the authoritative check that `/` remains statically prerendered.

## Revenue-page implications

Gate 5A adds three static, server-rendered revenue routes with shared CSS-only composition and a compact immutable commercial-facts module. No route-specific client boundary, animation, image, external request, runtime dependency, or JavaScript breakpoint logic is added. Production build output must confirm `/savings-sprint`, `/implementation`, and `/pricing` remain statically prerendered.

## Trust-page implications

Gate 6A adds three static, server-rendered Trust routes with shared CSS-only composition and a compact immutable facts module. It adds no route-specific client boundary, animation, image, external request, runtime dependency, or JavaScript breakpoint logic. Production build output must confirm `/method`, `/verification`, and `/security` remain statically prerendered.

## Conversion implications

Gate 7A adds no dependency, form library, analytics script, external request, image, or custom control. `/start` renders static commercial context on the server and hydrates one local form boundary for action state, pending feedback, repeat-submit prevention, and focus management. Request-time rendering issues the anti-abuse timestamp; CSS handles responsive composition. The standard Next.js build table does not report route client-byte totals, so no bundle-size claim is made.

## Budgets to lock

Final numeric budgets for JavaScript, CSS, media, fonts, LCP, INP, and CLS are **TBD** and must be approved during a later performance gate. Do not silently turn aspirational values into contractual targets.
