# Design system

These are working primitives for the design-system gate, not a finished visual language.

## Principles

Large, quiet architectural space should surround dense technical evidence. The future principal product-like object is the **Savings Ledger**. The recurring **Verification Line** will show movement from expected to verified savings. Neither should be implemented before its product and design definition is ready.

Avoid decorative gradients, blobs, stock imagery, generic dashboard mockups, excessive rounded cards, arbitrary animation, and imitation of Vercel. Prefer border hierarchy over large box shadows. Radius should be restrained; not every control or surface should be a pill.

## Working tokens

| Token | Value | Purpose |
| --- | --- | --- |
| canvas | `#F5F5F0` | Page ground |
| text-primary | `#11120F` | Primary content |
| text-secondary | `#696B64` | Supporting content |
| border | `#D8D9D2` | Structural separation |
| surface | `#FFFFFF` | Raised/contained surface |
| signal | `#3157FF` | Action and focus |
| verified | `#17744A` | Verified semantic state only |
| attention | `#A76513` | Attention semantic state |

Verified green is not the overall brand colour.

Primary sans: **Instrument Sans**. Technical and numeric type: **IBM Plex Mono**. Financial and data displays use tabular figures. Initial maximum container width is **1280px**; the initial large-screen grid is **12 columns**.

Major section rhythm is approximately **120–160px** on desktop and **80–96px** on mobile. Exact spacing, type scale, radii, responsive rules, and evidence-density patterns will be calibrated during the design-system gate.

## Motion

- Fast interaction: approximately `120ms`.
- Standard UI transition: approximately `220ms`.
- Narrative transition: approximately `500–700ms`.
- Preferred easing: `cubic-bezier(0.16, 1, 0.3, 1)`.

Use native scrolling. No scroll hijacking, cursor replacement, cursor trails, gratuitous parallax, or animation that prevents navigation. Interactions must work with `prefers-reduced-motion`; information cannot be hover-only, and mobile interactions cannot depend on a pointer.
