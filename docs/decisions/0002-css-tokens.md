# ADR 0002: CSS custom-property tokens

**Status:** Accepted

## Context

The company needs a bespoke, restrained identity without adopting a component kit that dictates visual language.

## Decision

Use semantic CSS custom properties as the source of truth for colour, type, spacing, and motion primitives. Start with a small global foundation and colocate component styles as complexity earns them.

## Consequences

Tokens remain inspectable and framework-independent. The team must deliberately document and review token changes rather than inherit a library's defaults.
