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

Instrument Sans is loaded as a committed variable WOFF2 and IBM Plex Mono as committed 400 and 500 WOFF2 assets. This preserves self-hosting in both Next.js and vinext builds, eliminates browser requests to Google, and uses `font-display: swap`.

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

Gate 7B adds the minimum Cloudflare/vinext build and test dependencies. `/start` retains one form client boundary and adds the required Turnstile script only on that route. Privacy and all other content remain server-rendered; `/privacy` is static. No analytics, tag manager, cookie banner, image optimiser, or client state dependency is added. CSS constrains the flexible Turnstile frame against horizontal overflow.

## Gate 8A production baseline and budgets

`pnpm test:performance` audits `/`, `/savings-sprint`, `/verification`, `/start`, and `/privacy` from clean Chromium contexts at 390px and 1440px, three times each against `next start`. It fails on non-200 responses, console errors, horizontal overflow, any unexpected third-party host, or these deterministic maximums: 9 JavaScript requests / 150,000 encoded bytes; 3 CSS requests / 14,500 bytes; 3 font requests / 52,000 bytes; and 31 total document-plus-resource requests.

The final Gate 8A baseline measured maxima of 9 JavaScript requests / 145,010 bytes, 3 CSS requests / 13,909 bytes, 3 fonts / 50,016 bytes, and 30 total requests. No audited page contacted a third-party host, emitted a console error, or overflowed. Self-hosted Instrument Sans and IBM Plex Mono use WOFF2 with `font-display: swap`; no duplicate or remote font request was found. Current pages use no content imagery or video, so there is no media-byte budget to disguise as a measured requirement.

The report also records median lab LCP and CLS as diagnostic signals. Across the final runs, route/width median LCP ranged from 112–148ms and median CLS from 0.00020–0.03198. They are deliberately not pass/fail budgets: a local unthrottled synthetic run does not establish field Core Web Vitals, and INP cannot be responsibly inferred without representative user interaction. Production field measurement remains deferred with the consent and analytics decision.
