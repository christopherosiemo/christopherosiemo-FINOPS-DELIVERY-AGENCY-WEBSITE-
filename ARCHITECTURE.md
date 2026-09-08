# Architecture

## Application

The site uses Next.js App Router, React, and strict TypeScript. Routes and layouts live in `src/app`. Components are server components unless a local interaction requires a client boundary. No global state library exists; introduce one only after a concrete cross-route state requirement appears.

## Structure

- `src/app/`: routes, layouts, and route metadata.
- `src/components/site/`: site-wide composition such as header and footer.
- `src/components/ui/`: reserved for proven, reusable primitives; currently absent to avoid premature abstraction.
- `src/lib/`: reserved for framework-independent utilities when required.
- `src/styles/`: global foundations and design tokens.
- `tests/components/`: lightweight component tests.
- `tests/e2e/`: browser-level critical-path tests.
- `docs/`: authoritative product, brand, engineering, and quality-gate context.

CSS custom properties are the source of truth for visual primitives. A single global foundation is appropriate at this stage; component-level styles may be colocated once the UI grows. Borders and spacing establish hierarchy before shadows or decoration.

## Rendering and data

Content is server-rendered by default. Client components must be small and justified by actual interactivity. There is no persistence, authentication, external API, analytics provider, or CMS at this gate; each is TBD pending product requirements and security review.

## Decisions

Meaningful decisions are recorded in `docs/decisions/`. See ADRs 0001–0003 for framework, styling, and testing choices.
