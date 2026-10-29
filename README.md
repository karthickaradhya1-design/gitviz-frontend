# gitviz-frontend
GitViz frontend: React + Vite commit graph, file evolution and health dashboard

## Frontend

The frontend is a React 18 + Vite + TypeScript application built for local Git analytics, file evolution tracking, and repository health metrics.

### Commands

```bash
# Install dependencies
npm install

# Start local development server with Vite (defaults to port 5173)
npm run dev

# Run Vitest unit, contract, and smoke test suite
npm test

# Build production bundle with TypeScript type-checking
npm run build
```

### Documentation

- [Architecture & Frontend Overview](docs/frontend.md) — Tech stack, directory structure, routing, design tokens, mock toggle, and known limits.
- [Backend Integration & Handoff Guide](docs/frontend-handoff.md) — REST API contracts, endpoints consumed, verification steps, and cross-team questions.
- [QA Verification Checklist](docs/frontend-qa-checklist.md) — Page-by-page manual test scenarios, edge-case test matrices, and claim-checking inventory.
