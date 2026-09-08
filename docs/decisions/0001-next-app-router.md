# ADR 0001: Next.js App Router

**Status:** Accepted

## Context

The public site needs strong server rendering, route-level metadata, small client payloads, and a structure that can grow without a global application shell.

## Decision

Use Next.js App Router with React and strict TypeScript. Render server components by default and add narrow client boundaries only for required interaction.

## Consequences

Routes and layouts remain framework-native, content is server-first, and unnecessary hydration is easier to avoid. Client-only libraries need explicit justification.
