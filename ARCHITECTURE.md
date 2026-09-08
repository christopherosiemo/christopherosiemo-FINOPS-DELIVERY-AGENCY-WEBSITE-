# Architecture

## Application

The site uses Next.js App Router, React, and strict TypeScript. Routes and layouts live in `src/app`. Components are server components unless a local interaction requires a client boundary. No global state library exists; introduce one only after a concrete cross-route state requirement appears.

## Structure

- `src/app/`: routes, layouts, and route metadata.
- `src/components/site/`: site-wide composition such as header and footer.
- `src/config/`: compact site identity, navigation, action, footer, and metadata configuration.
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

Functional Playwright checks and visual comparisons use separate configurations. Functional E2E remains portable and uses the development server locally; CI verifies the built application through `next start`. Ubuntu with the pinned Playwright Chromium version is the canonical visual-baseline environment. Baseline refreshes are deliberate and human-reviewed, never committed automatically.

## Rendering and data

Content is server-rendered by default. Client components must be small and justified by actual interactivity. There is no persistence, authentication, external API, analytics provider, or CMS at this gate; each is TBD pending product requirements and security review.

## Decisions

Meaningful decisions are recorded in `docs/decisions/`. See ADRs 0001–0003 for framework, styling, and testing choices.
