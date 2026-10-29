# GitViz — Frontend Technical Documentation

## 1. What the Frontend Is

The GitViz frontend is a client-side single-page application built with **React 18**, **Vite**, and **TypeScript**. It provides developer-oriented visual analytics for local Git repositories:
1. **Commit Graph (`/graph`)**: Virtualized directed acyclic graph (DAG) rendering branch tracks, merge curves, and commit metadata.
2. **File Evolution (`/files`)**: File picker, chronological modification timeline, unified diff inspection, and rename lineage breaks.
3. **Health Dashboard (`/dashboard`)**: Code churn hotspots, author distributions, estimated bus factor, and CSV/JSON snapshot export.
4. **About & Limitations (`/about`)**: Factual disclosure of Git limitations, statistical boundaries, FAQ, and privacy guarantees.

The browser **never** connects directly to Git, PostgreSQL, or external cloud services. All data flows exclusively through a single API choke point ([`src/api/client.ts`](../src/api/client.ts)).

---

## 2. How to Run

### Requirements
- Node.js 18+ (LTS recommended)
- npm 9+

### Commands
```bash
# 1. Install dependencies
npm install

# 2. Start local development server (default port 5173)
npm run dev

# 3. Execute automated test suite (Vitest)
npm test

# 4. Compile TypeScript and build production bundle
npm run build

# 5. Preview the production build locally
npm run preview
```

---

## 3. Directory Structure

```text
gitviz-frontend/
├── docs/                       # Project documentation, contracts, and handoff guides
├── public/                     # Static assets (SVG favicon, icons)
├── src/
│   ├── api/                    # Single API client choke point, React Query hooks, and types
│   ├── components/
│   │   ├── about/              # Limitations list, FAQ accordion, in-page TOC
│   │   ├── dashboard/          # Metric cards, Recharts charts, bus factor gauge
│   │   ├── files/              # Virtualized file picker, diff preview, timeline entries
│   │   ├── graph/              # Virtualized commit list, SVG gutter, details drawer
│   │   ├── home/               # Hero, features, how-it-works, CTA sections
│   │   ├── load/               # RepoPathForm, ImportProgress, WhatHappensCard, loadUtils
│   │   ├── states/             # LoadingSkeleton, EmptyState, and ErrorState fallbacks
│   │   └── ui/                 # Atomic design system (Button, Badge, Card, SectionHeading)
│   ├── content/                # Decoupled copy and static configuration (about.ts)
│   ├── context/                # Global React contexts (RepoContext)
│   ├── hooks/                  # Global hooks (usePageTitle)
│   ├── mock/                   # Hand-written JSON fixtures matching REST API schema
│   ├── styles/                 # Design tokens (tokens.css) and global rules (global.css)
│   ├── views/                  # Primary page views (Home, LoadRepo, Graph, Files, Dashboard, About, 404)
│   ├── App.tsx                 # Root router, query client, theme provider, and code splitting
│   └── main.tsx                # React DOM entry point
├── .env.example                # Template for environment configuration
├── index.html                  # HTML entry point with noscript and meta theme tags
├── package.json                # Project dependencies and script declarations
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite configuration and backend dev proxy
```

---

## 4. Routing Architecture

Routing is managed with `react-router-dom` v6 within [`src/App.tsx`](../src/App.tsx).

- **Layout Shell**: [`src/components/AppShell.tsx`](../src/components/AppShell.tsx) wraps all views with a sticky `<Header />`, a skip-to-content accessibility link, `<main id="main-content">`, and a global `<Footer />`.
- **Route-level Code Splitting**: Heavy analytical views (`/graph`, `/files`, `/dashboard`, `/about`, `/design-system`) are loaded on-demand via `React.lazy()` and wrapped in `<Suspense fallback={<LoadingSkeleton />}>`.
- **Eager Routes**: Landing page (`/`) and 404 (`*`) are loaded eagerly for immediate initial paint.
- **Route Focus & Titles**: [`src/hooks/usePageTitle.ts`](../src/hooks/usePageTitle.ts) automatically updates `document.title` to `<Page> | GitViz` and shifts keyboard focus to the view's primary heading on navigation.

---

## 5. Themes & Design Tokens

GitViz implements a strict **Navy + Cyan** palette designed for data clarity and accessibility (WCAG AA contrast compliant):
- **Base Tokens**: Defined in [`src/styles/tokens.css`](../src/styles/tokens.css) for 4px base spacing, typography scale, border radii, elevation shadows, and colorblind-friendly lane tracks (`--lane-1` through `--lane-8`).
- **Theme Activation**: The active theme (`light` or `dark`) is controlled by the `data-theme` attribute on the root `<html>` element.
- **Theme Persistence**: [`src/components/ThemeProvider.tsx`](../src/components/ThemeProvider.tsx) initializes from `localStorage` (`gitviz_theme_preference`), falls back to OS system preference (`prefers-color-scheme`), and synchronizes across tab sessions.
- **Rule on Cyan**: Cyan (`--color-accent`, `#00AEEF`) is strictly reserved for highlights, borders, active focus indicators, and icons; it is **never** used for body text on light backgrounds.

---

## 6. Mock Data & Switching to Live Backend

### The Single Choke Point
All backend communications are routed strictly through [`src/api/client.ts`](../src/api/client.ts). No component contains fetch calls or hardcoded API routes.

### Switching from Mock to Live API
The application defaults to mock mode for offline demonstration and testing.
To point to the real backend Express server:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set `VITE_USE_MOCK=false` in `.env`:
   ```env
   VITE_USE_MOCK=false
   ```
3. When `VITE_USE_MOCK=false`, the client issues real HTTP `fetch()` calls to `/api/v1/...`. During development, `vite.config.ts` proxies requests to `http://localhost:3000`.

### Testing Fallback States
In mock mode, append the `?state=` query parameter to test UI resilience:
- `?state=loading`: Forces simulated network delay to verify loading skeletons.
- `?state=empty`: Returns empty datasets to verify empty states.
- `?state=error`: Throws simulated network exceptions to verify error handling and retry actions.
- `?state=import-error`: On `/load`, simulates ingestion failure at ~60% progress.
- `?state=slow`: On `/load`, slows down progress increments to +10% per poll.

---

## 7. Repository Context & Local Storage

Repository state is centralized in [`src/context/RepoContext.tsx`](../src/context/RepoContext.tsx) via the `useRepo()` hook.

- **Current Repository State**: Holds `{ repoId, name, path, status, commitCount }` or `null`.
- **Mock Fallback**: `activeRepoId` automatically falls back to `'sample-repo'` **only** when `USE_MOCK` is true. When `USE_MOCK=false` and no repository has been imported, analytical pages (`/graph`, `/files`, `/dashboard`) display an `EmptyState` prompting the user to load a repository at `/load`.
- **Status Resumption on Mount**: If a stored repository exists in `localStorage`, the context calls `getRepoStatus({ repoId })` once on mount to synchronize the latest ingestion status or commit totals.

### LocalStorage Keys Used
| Storage Key | Type / Contents | Purpose |
|---|---|---|
| `gitviz_current_repo` | JSON `{ repoId, name, path }` | Persists currently active repository across page refreshes. |
| `gitviz_recent_repos` | Array of `{ path, name, lastLoadedAt }` | Stores up to 5 recently opened repositories for quick selection. |
| `gitviz_theme_preference` | `'light' \| 'dark'` | Persists user theme preference independently of OS default. |

---

## 8. How to Add a New Endpoint or Mock Fixture

1. **Declare Types**: Add TypeScript interface definitions in [`src/api/types.ts`](../src/api/types.ts).
2. **Add Mock JSON**: Create a realistic JSON fixture in `src/mock/` adhering strictly to the schema.
3. **Expose Client Method**: Implement the getter function in [`src/api/client.ts`](../src/api/client.ts) with `if (USE_MOCK) return mockData;` branch and a real `fetch()` branch.
4. **Create React Query Hook**: Export a wrapper hook in [`src/api/hooks.ts`](../src/api/hooks.ts).
5. **Add Contract Test**: Add a runtime shape validation case to [`src/mock/contract.test.ts`](../src/mock/contract.test.ts).

---

## 9. Known Limitations of the Frontend

1. **DOM Node Ceiling**: While virtualized rendering (`@tanstack/react-virtual`) ensures that only visible rows are drawn in the commit list and file picker, browser engines experience memory pressure when rendering complex SVG DAGs with over 10,000 nodes simultaneously.
2. **Heuristic Track Intersections**: Resolving crossing lines in arbitrary Git DAGs without track intersections is NP-hard. Greedy lane layout heuristics minimize track crossovers, but merge-dense repositories may exhibit track crossings.
3. **Local In-Memory Export**: In mock mode, snapshot export is limited to in-memory JSON serialization and top-file CSV generation via browser Blobs.
