# Architecture

## Application

The site uses Next.js App Router, React, and strict TypeScript. Routes and layouts live in `src/app`. Components are server components unless a local interaction requires a client boundary. No global state library exists; introduce one only after a concrete cross-route state requirement appears.

## Structure

- `src/app/`: routes, layouts, and route metadata.
- `src/components/site/`: site-wide composition such as header and footer.
- `src/components/home/`: bespoke server-rendered homepage narrative units and their shared static composition styles.
- `src/components/revenue/`: shared server-rendered revenue-page structure and CSS-only commercial decision patterns.
- `src/components/trust/`: shared server-rendered Trust-page composition and CSS-only evidence structures.
- `src/config/`: compact site identity, navigation, action, footer, metadata, commercial, and Trust-fact configuration.
- `src/components/ui/`: reusable action, field, status, dense-ledger, and verification primitives proven on the homepage or internal specimen.
- `src/lib/`: reserved for framework-independent utilities when required.
- `src/styles/`: global foundations and design tokens.
- `tests/components/`: lightweight component tests.
- `tests/e2e/`: browser-level critical-path tests.
- `docs/`: authoritative product, brand, engineering, and quality-gate context.

CSS custom properties remain the source of truth. `src/styles/tokens.css` separates primitive values from semantic roles; `src/styles/globals.css` consumes them for reset, typography, layout, focus, and shared shell behavior. Component values are colocated in CSS Modules only where the component has a genuine local need. Borders and spacing establish hierarchy before shadows or decoration.

`/design-system` is an internal, statically rendered calibration route. It is excluded from public navigation and marked `noindex, nofollow`; it must be removed, access-controlled, or otherwise excluded from the public production experience before launch.

The global header and footer remain server components. `SiteNavigation` is the only shell client boundary because it owns pathname-aware `aria-current` state and the native `<dialog>` lifecycle required for the mobile/tablet menu. The native modal supplies background inertness and contained focus; local code handles opening, explicit/Escape close state, and focus return. No state, menu, icon, or animation dependency is used.

Public navigation values and the operator-provided `HKGpipi` identity live in `src/config/site.ts`; the retired `CMR` mark was a working placeholder. Repeated incomplete-route structure is isolated in the server-rendered `RouteScaffold`; it is intentionally not a universal page-template abstraction. Each scaffold exports route metadata with `noindex, nofollow`. Root metadata uses `HKGpipi — Cloud Margin Recovery` with the route template `%s | HKGpipi` and the approved description. Canonical protocol/www policy, social assets, production logo, and organisation metadata remain deferred.

The homepage is composed from narrative-specific Server Components rather than a config-driven marketing renderer. Its Ledger reuses the existing semantic table/labelled-record primitive through narrowly scoped content props, while the Verification Line accepts only contextual labelling. Gate 4B adds one null-rendering `HomeMotionController` client boundary that progressively enhances stable server-rendered targets through Intersection Observer state; all meaning remains present in initial HTML, and responsive composition remains CSS-only.

The Savings Sprint, Implementation, and Pricing routes use a small set of revenue-specific Server Components for shared hero, section introduction, ordered sequence, and action structure. Immutable offer names and approved prices live in `src/config/commercial.ts`; narrative content remains route-local so material distinctions stay explicit. The three routes share one CSS Module, add no client boundary, and retain `noindex, nofollow` metadata.

The Method, Verification, and Security routes use a small set of Trust-specific Server Components for shared hero, section introduction, and action structure. Immutable operating stages and approved boundary phrases live in `src/config/trust.ts`; detailed narratives remain route-local. Their semantic matrices reflow into labelled records below 1280px. Because every current Trust route ends with route-specific actions, `TrustPage` emits the existing stable footer-CTA suppression attribute by default; footer navigation and identity remain unchanged. The three routes share one CSS Module, add no client boundary or dependency, and retain `noindex, nofollow` metadata.

Functional Playwright checks and visual comparisons use separate configurations. Functional E2E remains portable and uses the development server locally; CI verifies the built application through `next start`. Ubuntu with the pinned Playwright Chromium version is the canonical visual-baseline environment. Baseline refreshes are deliberate and human-reviewed, never committed automatically.

## Rendering and data

Content is server-rendered by default. Client components must be small and justified by actual interactivity. There is no persistence, authentication, external API, analytics provider, or CMS at this gate; each is TBD pending product requirements and security review.

## Decisions

Meaningful decisions are recorded in `docs/decisions/`. See ADRs 0001–0003 for framework, styling, and testing choices.
