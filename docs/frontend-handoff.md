# GitViz — Frontend to Backend Live Integration Handoff

This checklist guides the engineering team on the day the Node.js/Express backend (P1) and PostgreSQL metrics service (P2) go live.

---

## 1. Quick Switch Checklist

- [ ] **Step 1:** Create or update `.env` in the frontend root:
  ```env
  VITE_USE_MOCK=false
  ```
- [ ] **Step 2:** Confirm the backend port in [`vite.config.ts`](../vite.config.ts). The default proxy targets `http://localhost:3000`. Adjust `BACKEND_DEV_PROXY_TARGET` if the Express server listens on a different port.
- [ ] **Step 3:** Start the backend server and ensure database migrations have executed.
- [ ] **Step 4:** Restart Vite dev server (`npm run dev`) or test production build (`npm run build`).

---

## 2. Endpoints Called by the Frontend

The frontend calls **only** the following REST endpoints through [`src/api/client.ts`](../src/api/client.ts):

| Method | Endpoint Path | React Query Hook | Consuming View | Mock Reference File |
|---|---|---|---|---|
| `GET` | `/api/v1/repos/:id/commits?cursor=&limit=` | `useCommits(repoId, params)` | Commit Graph (`/graph`) | [`src/mock/commits.json`](../src/mock/commits.json) |
| `GET` | `/api/v1/repos/:id/commits/:sha` | `useCommit(repoId, sha)` | Commit Graph Drawer (`/graph`) | [`src/mock/commit-detail.json`](../src/mock/commit-detail.json) |
| `GET` | `/api/v1/repos/:id/files` | `useFiles(repoId)` | File Evolution Sidebar (`/files`) | [`src/mock/files.json`](../src/mock/files.json) |
| `GET` | `/api/v1/repos/:id/files/:path/history` | `useFileHistory(repoId, path)` | File Evolution Timeline (`/files`) | [`src/mock/file-history.json`](../src/mock/file-history.json) |
| `GET` | `/api/v1/repos/:id/metrics/churn` | `useChurn(repoId)` | Health Dashboard (`/dashboard`) | [`src/mock/metrics-churn.json`](../src/mock/metrics-churn.json) |
| `GET` | `/api/v1/repos/:id/metrics/bus-factor` | `useBusFactor(repoId)` | Health Dashboard (`/dashboard`) | [`src/mock/metrics-bus-factor.json`](../src/mock/metrics-bus-factor.json) |
| `GET` | `/api/v1/repos/:id/export?format=json\|csv` | `downloadExport(...)` | Dashboard Export Button (`/dashboard`) | Server stream or downloadable Blob |

---

## 3. Things to Verify During Live Testing

1. **Cursor-based Pagination**:
   - Verify `next_cursor` is returned as `null` at the end of commit history.
   - Verify pagination requests pass `cursor` query parameters properly without off-by-one offsets.
2. **Path Encoding**:
   - Verify files containing spaces, special characters, and Unicode paths (e.g., `docs/spécial file.ts`) resolve correctly when URL-encoded via `encodeURIComponent(path)`.
3. **Rename Detection & Breaks**:
   - Verify `old_path` is populated on detected renames.
   - Verify `break_after` is set when Git's similarity threshold loses track of an earlier file lineage.
   - Verify `history_complete: false` triggers the incomplete history warning banner.
4. **Merge Commit Driving Churn Tooltips**:
   - Confirm whether `merge_commits_counted` is `true` or `false` in `/api/v1/repos/:id/metrics/churn`. The UI automatically updates chart tooltips and notes based on this boolean.
5. **Snapshot Export**:
   - Trigger both JSON and CSV exports from `/dashboard` and verify downloaded files match the PostgreSQL schema.
6. **Error States & Down-time Resilience**:
   - Stop the backend server and verify that [`src/components/states/ErrorState.tsx`](../src/components/states/ErrorState.tsx) appears with a functional "Try again" retry trigger.

---

## 4. Questions for Backend (P1) and Data (P2) Teammates

1. **Backend Port**: Is Express running on port `3000`, or should `BACKEND_DEV_PROXY_TARGET` in `vite.config.ts` be set to a different port?
2. **Default Repository ID**: What is the default repo ID served during local development (`"default"` or a dynamic identifier)?
3. **Ingestion & Status Polling**: When a user imports a new repository via `POST /api/v1/repos`, should the frontend poll `/api/v1/repos/:id/status` before mounting `/graph`?
4. **Field Naming Uniformity**: Do all snake_case field names match [`src/api/types.ts`](../src/api/types.ts) (`churn_commits`, `churn_lines`, `top_author_share`)?
5. **History Break Threshold**: What is the similarity cutoff percentage used in Git log rename detection (e.g., `-M50%` or `-M80%`)?
