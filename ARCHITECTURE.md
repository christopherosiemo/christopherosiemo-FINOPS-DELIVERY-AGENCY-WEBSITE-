# Architecture

## Application

The site uses Next.js App Router, React, and strict TypeScript. Routes and layouts live in `src/app`. Components are server components unless a local interaction requires a client boundary. No global state library exists; introduce one only after a concrete cross-route state requirement appears.

## Structure

- `src/app/`: routes, layouts, and route metadata.
- `src/components/site/`: site-wide composition such as header and footer.
- `src/components/home/`: bespoke server-rendered homepage narrative units and their shared static composition styles.
- `src/components/revenue/`: shared server-rendered revenue-page structure and CSS-only commercial decision patterns.
- `src/components/trust/`: shared server-rendered Trust-page composition and CSS-only evidence structures.
- `src/components/conversion/`: the server-rendered `/start` composition and its narrowly scoped form-state client boundary.
- `src/config/`: compact site identity, navigation, action, footer, acquisition metadata, commercial, and Trust-fact configuration.
- `src/components/ui/`: reusable action, field, status, dense-ledger, and verification primitives proven on the homepage or internal specimen.
- `src/lib/`: framework-independent utilities.
- `src/lib/enquiry/`: typed enquiry validation, delivery, rate-limit, and submission boundaries.
- `src/styles/`: global foundations and design tokens.
- `tests/components/`: lightweight component tests.
- `tests/e2e/`: browser-level critical-path tests.
- `scripts/performance-audit.mjs`: deterministic production asset/network lab audit.
- `docs/`: authoritative product, brand, engineering, and quality-gate context.

CSS custom properties remain the source of truth. `src/styles/tokens.css` separates primitive values from semantic roles; `src/styles/globals.css` consumes them for reset, typography, layout, focus, and shared shell behavior. Component values are colocated in CSS Modules only where the component has a genuine local need. Borders and spacing establish hierarchy before shadows or decoration.

`/design-system` is an internal, statically rendered calibration route. It is excluded from public navigation and marked `noindex, nofollow`; it must be removed, access-controlled, or otherwise excluded from the public production experience before launch.

The global header and footer remain server components. `SiteNavigation` is the only shell client boundary because it owns pathname-aware `aria-current` state and the native `<dialog>` lifecycle required for the mobile/tablet menu. The native modal supplies background inertness and contained focus; local code handles opening, explicit/Escape close state, and focus return. No state, menu, icon, or animation dependency is used.

Public navigation values, the operator-provided `HKGpipi` identity, and the single `https://hkgpipi.com` production origin live in `src/config/site.ts`; the retired `CMR` mark was a working placeholder. `src/config/acquisition.ts` owns the route intent, title, description, canonical, indexing, robots, sitemap, and restricted structured-data model. Only explicit `APP_ENVIRONMENT=production` enables acquisition; every other value fails closed to noindex, a disallow-all robots policy, an empty sitemap, and no JSON-LD. This prevents the production-built staging Worker from becoming indexable or emitting workers.dev acquisition URLs.

Each public page exports route-specific server metadata through `routeMetadata`; the root layout supplies only the production metadata base, fallback title template, and environment-gated Organization/WebSite/Service graph. Framework-native robots, sitemap, Open Graph image, and icon routes add no client JavaScript. Conversion, Privacy, design-system, test/error, and unknown routes remain noindex or excluded. Production routing, redirects, and external discovery activation remain deferred to the authorized cutover; external search ownership is already verified.

The homepage is composed from narrative-specific Server Components rather than a config-driven marketing renderer. Its Ledger reuses the existing semantic table/labelled-record primitive through narrowly scoped content props, while the Verification Line accepts only contextual labelling. Gate 4B adds one null-rendering `HomeMotionController` client boundary that progressively enhances stable server-rendered targets through Intersection Observer state; all meaning remains present in initial HTML, and responsive composition remains CSS-only.

The Savings Sprint, Implementation, and Pricing routes use a small set of revenue-specific Server Components for shared hero, section introduction, ordered sequence, and action structure. Immutable offer names and approved prices live in `src/config/commercial.ts`; narrative content remains route-local so material distinctions stay explicit. The three routes share one CSS Module, add no client boundary, and retain `noindex, nofollow` metadata.

The Method, Verification, and Security routes use a small set of Trust-specific Server Components for shared hero, section introduction, and action structure. Immutable operating stages and approved boundary phrases live in `src/config/trust.ts`; detailed narratives remain route-local. Their semantic matrices reflow into labelled records below 1280px. Because every current Trust route ends with route-specific actions, `TrustPage` emits the existing stable footer-CTA suppression attribute by default; footer navigation and identity remain unchanged. The three routes share one CSS Module, add no client boundary or dependency, and retain `noindex, nofollow` metadata.

`/start` is request-rendered. Static commercial context remains in a Server Component; `EnquiryForm` is the conversion client boundary and owns React action state, the Managed Turnstile widget, pending feedback, repeat-submit prevention, and focus movement. The Server Action treats input as untrusted and orders origin, honeypot, allow-list/validation, SQLite Durable Object rate limiting, Siteverify, and Email Service delivery. `/privacy` is a static faithful rendering of the approved policy. `/contact` points to the form and the authorised manual email channel.

App Router `not-found.tsx` supplies the hard-404 recovery surface and inherits the normal server-rendered shell; Next supplies its `noindex`. The nearest `error.tsx` boundary is a deliberately small client component with retry and home recovery but no exception detail. No root global-error boundary is added because the root layout has no request-time failure source that justifies a duplicate client-rendered document shell.

Functional Playwright checks and visual comparisons use separate configurations. Functional E2E remains portable and uses the development server locally; CI verifies the built application through `next start`. Ubuntu with the pinned Playwright Chromium version is the canonical visual-baseline environment. Baseline refreshes are deliberate and human-reviewed, never committed automatically.

Engineering Playwright checks use a separate production-server configuration for response headers, caching, secret leakage, forced colours, WCAG text spacing, and hard-404 behavior. A second bounded production configuration runs mobile critical-path smoke in Chromium, Firefox, and WebKit. The performance script audits fresh production contexts against committed deterministic resource ceilings; its LCP/CLS values are lab diagnostics, not field claims.

## Rendering and data

Content is server-rendered by default. Client components must be small and justified by actual interactivity. Cloudflare Workers is the runtime through vinext. Staging and production are separate Worker scripts with separate secrets and Durable Object namespaces. The production script is deployable but intentionally unreachable until its apex Custom Domain is explicitly authorized. Durable Object persistence is limited to rate-limit timestamps; enquiries are delivered through a sender-restricted Email Service binding to a verified destination held only in a Worker secret and are not stored in an application database. There is no authentication, analytics provider, CRM, Redis, or CMS.

## Decisions

Meaningful decisions are recorded in `docs/decisions/`. See ADRs 0001–0003 for framework, styling, and testing choices.
