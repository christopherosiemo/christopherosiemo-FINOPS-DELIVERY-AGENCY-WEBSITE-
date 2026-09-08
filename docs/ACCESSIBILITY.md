# Accessibility

The target is **WCAG 2.2 AA** unless a later approved requirement supersedes it.

Foundation requirements:

- semantic header, navigation, main, section, and footer landmarks;
- one clear primary heading and correct heading hierarchy;
- keyboard-operable navigation and controls;
- a working skip-to-content link;
- visible, high-contrast focus treatment;
- sufficient text and UI contrast;
- accessible names for interactive controls;
- sensible minimum touch targets;
- reduced-motion support;
- no hover-only information or pointer-dependent mobile behavior.

## Design-system decisions

- Ordinary text combinations are measured in `DESIGN_SYSTEM.md`; secondary text is `#60625C`, measuring 5.65:1 on canvas and 6.18:1 on white.
- Attention text uses `#8A4A0A`, not the lower-contrast `#A76513`, on warm-light backgrounds.
- Global focus uses a 2px outline with 3px offset; inverse surfaces use a white focus token. Future sticky UI must preserve focus visibility.
- Standalone controls target at least 44×44px. Primary controls are 48px high.
- Form errors use explicit text, a symbol, `aria-invalid`, and described-by association; colour is supplemental.
- Lifecycle states always contain readable text and a shape marker. Verified green and attention amber are not the only carriers of meaning.
- The Savings Ledger uses a semantic table at 1280px and above and labelled records below 1280px, preventing illegible column compression.
- The Verification Line exposes expected, verified, absolute variance, and percentage variance as text; its connector is supplemental, and reduced motion retains the final reconciled state.

Automated Axe checks cover `/` and `/design-system`. Direct browser tests cover skip navigation, keyboard focus visibility, button/link semantics, form label association, reduced motion, indexing metadata, and horizontal overflow at required viewports.

Automated checks reduce risk but do not replace keyboard, screen-reader, zoom/reflow, contrast, and content review. Supported assistive-technology/browser test combinations are TBD before production qualification.
