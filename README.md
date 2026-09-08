# Cloud Margin Recovery website

Production website foundation for engineering-led AWS cost reduction, verified against the bill. This repository currently contains the engineering foundation and a deliberately minimal application shell—not the finished public website.

## Requirements

- Node.js 22–25 (Node 24 is used in CI)
- pnpm 11.19.0

## Setup

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Validation

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm exec playwright install chromium
pnpm test:e2e
pnpm build
```

Start with [docs/README.md](docs/README.md) for project context and [ARCHITECTURE.md](ARCHITECTURE.md) for code structure.
