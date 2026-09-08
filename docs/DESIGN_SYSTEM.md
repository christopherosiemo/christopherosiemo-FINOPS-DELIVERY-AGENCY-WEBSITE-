# Design system

This document is authoritative for the Gate 2 design primitives. The system has completed its Gate 2B correction pass but remains pending remote CI verification and independent visual approval; it may remain at 18%, not the 20% design-primitives exit.

## MEASURED doctrine

Evidence over assertion. Precision over spectacle. Reduction over addition. Engineering before marketing. Every number has provenance. Every recommendation has a path to production. Every claimed saving ends at the bill.

The visual sensation is large, calm architectural space surrounding dense technical evidence. The system avoids decorative gradients, blobs, stock imagery, generic dashboard compositions, large generic card radii, dramatic shadows, arbitrary motion, and imitation of Vercel or any other technology brand.

## Token architecture

`src/styles/tokens.css` is the source of truth and contains three layers:

1. **Primitive values** name the small approved palette and fixed scales. Components do not use primitives directly.
2. **Semantic roles** describe intent: canvas, text, borders, signal, verified, attention, focus, type, spacing, rhythm, and interaction.
3. **Component values** live in CSS Modules only when a component has a genuine local need, such as the Verification Line marker size.

`src/styles/globals.css` consumes semantic tokens for reset, typography, focus, layout utilities, the existing public shell, and global reduced-motion behavior. Component and specimen styles use CSS Modules. Adding a semantic role is preferred to copying a primitive value into components.

## Colour

### Primitive palette

| Primitive | Value | Intent |
| --- | --- | --- |
| Warm canvas | `#F5F5F0` | Warm-light page ground |
| White surface | `#FFFFFF` | Primary evidence surface |
| Primary ink | `#11120F` | Primary text; avoids indiscriminate pure black |
| Inverse surface | `#22231F` | Deliberate inverse area |
| Secondary ink | `#60625C` | Optically stronger supporting text that passes AA |
| Border | `#D8D9D2` | Default structural boundary |
| Strong border | `#9B9D94` | Deliberate separation |
| Signal | `#3157FF` | Action and focus |
| Signal hover | `#2647D6` | Stronger interactive state |
| Verified | `#17744A` | Verified semantic state, never the whole brand |
| Verified text | `#0D5C39` | Accessible text on verified surface |
| Verified surface | `#E5F3EC` | Restrained verified background |
| Attention | `#A76513` | Accent, marker, and suitable fill |
| Attention text | `#8A4A0A` | Accessible caution text |
| Attention surface | `#F8EAD9` | Restrained attention background |

Semantic roles include canvas, surface, subtle surface, inverse surface, primary/secondary/muted/inverse text, default/strong borders, signal/hover, verified/accent/text/surface, attention/accent/text/surface, and normal/inverse focus.

`#A76513` is not used for ordinary small text on canvas. It remains an accent; `#8A4A0A` is the attention text role.

### Contrast matrix

Ratios were calculated from sRGB relative luminance and rounded to two decimals.

| Foreground | Background | Ratio | Normal text |
| --- | --- | ---: | --- |
| Primary `#11120F` | Canvas `#F5F5F0` | 17.19:1 | Pass AA/AAA |
| Secondary `#60625C` | Canvas `#F5F5F0` | 5.65:1 | Pass AA |
| Primary `#11120F` | Surface `#FFFFFF` | 18.80:1 | Pass AA/AAA |
| Secondary `#60625C` | Surface `#FFFFFF` | 6.18:1 | Pass AA |
| Inverse text `#FFFFFF` | Inverse surface `#22231F` | 15.81:1 | Pass AA/AAA |
| Signal `#3157FF` | Canvas `#F5F5F0` | 4.88:1 | Pass AA |
| Signal `#3157FF` | Surface `#FFFFFF` | 5.33:1 | Pass AA |
| Signal hover `#2647D6` | Canvas `#F5F5F0` | 6.50:1 | Pass AA |
| Verified text `#0D5C39` | Verified surface `#E5F3EC` | 7.04:1 | Pass AA/AAA |
| Attention text `#8A4A0A` | Attention surface `#F8EAD9` | 5.80:1 | Pass AA |
| Attention text `#8A4A0A` | Canvas `#F5F5F0` | 6.27:1 | Pass AA |

Context-specific combinations still require review. Passing contrast does not make an inappropriate semantic use acceptable.

## Typography

Instrument Sans is the primary/interface/editorial family. It loads as a variable Google font through `next/font`, is self-hosted by Next.js, uses `display: swap`, and is exposed as `--font-sans`. IBM Plex Mono loads weights 400 and 500 the same way and is exposed as `--font-mono`. Browser runtime font-loading scripts are prohibited.

Fallbacks are Arial/sans-serif and Courier New/monospace. The scale uses weights 400, 500, and 600; 700 is not part of the current system.

| Role | Size | Line height | Tracking |
| --- | --- | --- | --- |
| Display XL | `clamp(48px, fluid, 84px)` | 0.94 | `-0.045em` |
| Display L | `clamp(40px, fluid, 64px)` | 0.96 | `-0.04em` |
| Heading 1 | `clamp(36px, fluid, 48px)` | 1.0 | `-0.035em` |
| Heading 2 | `clamp(32px, fluid, 40px)` | 1.05 | `-0.03em` |
| Heading 3 | `clamp(26px, fluid, 32px)` | 1.1 | `-0.025em` |
| Heading 4 | `clamp(22px, fluid, 24px)` | 1.2 | default |
| Body large | `clamp(18px, fluid, 20px)` | 1.5 | default |
| Body | 16px | 1.6 | default |
| Body small | 14px | 1.55 | default |
| Caption | 12px | 1.5 | default |
| Technical label | 12px IBM Plex Mono | 1.4 | `0.06em` |

Technical labels use uppercase only when label semantics warrant it. Text measures are 45ch compact, 65ch prose, and 75ch wide. Prose does not span the full grid without a documented reason.

Financial values, percentages, dates, IDs, and dense numeric displays use tabular lining figures. Monetary units and periods remain subordinate; a large number always retains its label and period.

## Spacing and vertical rhythm

The bounded scale is 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120, and 160px. Use the nearest intentional token. Optical exceptions are permitted only where a typeface or alignment visibly requires one; document recurring exceptions instead of adding near-duplicate tokens.

Section rhythm distinguishes:

- **Standard:** 88px mobile, 112px tablet, 128px desktop.
- **Major:** 96px mobile, 120px tablet, 160px desktop.
- **Tight grouping:** 16px for closely related content.
- **Data density:** 12px for compact technical evidence.

Not every section uses the same separation. The identity depends on the contrast between quiet macro spacing and dense micro information.

## Container, grid, and breakpoints

The container maximum is 1280px. Gutters and grids change at three deliberate breakpoints:

| Width | Gutter | Columns | Gap |
| --- | ---: | ---: | ---: |
| Below 768px | 20px | 4 | 12px |
| 768–1279px | 24px | 8 | 16px |
| 1280–1439px | 32px | 12 | 24px |
| 1440px and above | minimum 48px; container remains capped | 12 | 24px |

CSS media queries drive ordinary layout; there is no JavaScript breakpoint system. Reusable `.container` and `.site-grid` utilities expose the structure. CSS Modules may create local grids from the same tokens.

## Radii, borders, and elevation

- Small: 4px for status and compact details.
- Control: 8px for buttons and fields.
- Panel: 12px only where grouping benefits comprehension.
- Pill: 999px only for genuinely pill-like semantics such as a small circular marker.

Default and strong borders are one pixel. Full-grid architectural panels may remain square. Nested rounded rectangles are exceptional. Ordinary cards have no shadow; the single elevation token is reserved for temporary raised interfaces such as menus, popovers, and dialogs. Dramatic “premium” shadows are prohibited.

## Controls and focus

Standalone targets are at least 44×44px. Primary controls are 48px high; compact controls may be 40px only when context and usable hit area justify it. Buttons perform actions and links navigate.

Primary, secondary, quiet, and inline directional treatments implement default, hover, focus-visible, active, and disabled behavior. Hover translation is one pixel; active translation is one pixel in the opposite direction. Directional icons move four pixels at most. Reduced motion removes those transforms.

The global focus treatment is a 2px signal outline with a 3px offset. Inverse surfaces switch to the inverse focus token. Focusable elements use scroll margin so focus is not hidden by future sticky UI. Never remove outlines without an equally visible replacement.

## Pointer behavior

Feedback comes primarily from border, surface, text, or a very small translation. Normal displacement is 0–2px. Four pixels is the absolute intended maximum for any future local magnetic behavior, which must never be global. No cursor replacement, follower, trail, fake scroll inertia, pointer-triggered non-interactive motion, or hover-only information.

## Motion and reduced motion

- Fast: 120ms.
- Standard: 220ms.
- Narrative: 560ms.
- Primary easing: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Linear: only where the underlying value is genuinely linear.

Motion is finite and never required to reveal meaning. Narrative demonstrations run once over 560ms with the primary easing and settle into their final state; infinite decorative animation is prohibited. Native scrolling is retained. Scroll hijacking, custom cursors, particles, gratuitous parallax, and navigation-blocking animation are prohibited.

With `prefers-reduced-motion: reduce`, non-essential animations and transitions resolve in approximately 0.01ms or are removed; smooth scrolling is not forced. The Verification Line and all status/data meaning are complete without animation.

## Forms

The primitive pairs a real label with the control and connects hint or error text through `aria-describedby`. Error state uses text, an explicit symbol, `aria-invalid`, border, and surface—not colour alone. Disabled state remains readable and programmatically disabled. The specimen fields are neutral examples and do not define the final conversion form.

## Status language

Lifecycle vocabulary is Discovered, Validated, Assigned, Remediation ready, Awaiting approval, Approved, Deployed, Measuring, and Verified. Most states are neutral. Awaiting approval and Measuring use restrained attention treatment; Verified alone uses verified green. Every status includes readable text and a shape marker, so state is not colour-only.

## Dense data

Currency, periods, annualised values, percentages, confidence, account/resource IDs, service names, repository/IaC paths, dates, and state preserve explicit label/value association. IDs and paths use IBM Plex Mono and wrap safely. Dense text may reach 12–14px only when contrast and line height retain readability. Numeric columns align right and use tabular figures.

## Savings Ledger visual concept

The internal specimen is static and labelled **Illustrative**; it is not customer evidence or the production component. Desktop at 1280px and above uses a dense semantic table with opportunity, account/service, owner, expected saving, confidence, risk, and state. Numeric values align right. Below 1280px it becomes compact labelled records instead of squeezing seven columns. The fields retain semantic association, technical identifiers wrap, and intermediate states stay visually neutral.

Final schema, interactivity, sorting, provenance presentation, and product integration remain TBD.

## Verification Line visual concept

The line is a reconciliation instrument representing estimate → reconciliation → measured result, not percentage completion. Both annualised values remain dominant and visible as text. A subordinate centre annotation records variance to expected: `£176,420 − £184,000 = −£7,580`, with percentage variance calculated from the expected value as `−£7,580 / £184,000 = −4.119565…%`, displayed as `−4.1%`. The thin architectural connector has no filled track, loading state, or percentage-complete metaphor. Text and marker geometry preserve meaning without colour, and the composition collapses to a readable mobile stack.

The motion demonstration resolves the reconciliation annotation once over 560ms while the economic values and connector remain present throughout. Reduced motion presents the final reconciled state immediately. Final methodology, value attribution, and homepage integration remain TBD.

## Responsive principles

Design continuously, not only at screenshot widths. At 320px the page itself must not scroll horizontally; only an explicitly contained code/data surface may scroll internally. Buttons wrap without clipped labels, mono values wrap safely, focus outlines remain visible, and dense tables transform into labelled records before they become illegible.

The internal `/design-system` route is the calibration instrument. It is `noindex, nofollow`, absent from public navigation, and must be removed, access-controlled, or otherwise excluded from the public production experience before launch.
