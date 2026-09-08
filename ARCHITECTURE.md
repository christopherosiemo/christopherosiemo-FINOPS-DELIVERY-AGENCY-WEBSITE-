# Architecture

## Application

The site uses Next.js App Router, React, and strict TypeScript. Routes and layouts live in `src/app`. Components are server components unless a local interaction requires a client boundary. No global state library exists; introduce one only after a concrete cross-route state requirement appears.

## Structure

- `src/app/`: routes, layouts, and route metadata.
- `src/components/site/`: site-wide composition such as header and footer.
- `src/components/ui/`: reusable action, field, status, dense-ledger, and verification primitives proven on the homepage or internal specimen.
- `src/lib/`: reserved for framework-independent utilities when required.
- `src/styles/`: global foundations and design tokens.
- `tests/components/`: lightweight component tests.
- `tests/e2e/`: browser-level critical-path tests.
- `docs/`: authoritative product, brand, engineering, and quality-gate context.

CSS custom properties remain the source of truth. `src/styles/tokens.css` separates primitive values from semantic roles; `src/styles/globals.css` consumes them for reset, typography, layout, focus, and shared shell behavior. Component values are colocated in CSS Modules only where the component has a genuine local need. Borders and spacing establish hierarchy before shadows or decoration.

`/design-system` is an internal, statically rendered calibration route. It is excluded from public navigation and marked `noindex, nofollow`; it must be removed, access-controlled, or otherwise excluded from the public production experience before launch.

## Rendering and data

Content is server-rendered by default. Client components must be small and justified by actual interactivity. There is no persistence, authentication, external API, analytics provider, or CMS at this gate; each is TBD pending product requirements and security review.

## Decisions

Meaningful decisions are recorded in `docs/decisions/`. See ADRs 0001–0003 for framework, styling, and testing choices.
