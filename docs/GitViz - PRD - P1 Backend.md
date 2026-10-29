---
tags:
  - project/gitviz
  - prd
  - p1-backend
  - nodejs
  - express
  - postgresql
type: prd
role: P1
status: planning
created: 2026-10-29
---

# GitViz — PRD: P1 Backend (Node.js + Express)

> [!quote] One-Liner
> "Turn any local `.git` folder into JSON the UI can draw — one pass over history, one Express REST API, $0 cost."

> *P1 owns the input side: reading Git and serving the API. P2 owns the numbers side (metrics/DB). The frozen Postgres schema (Week 1) is the only hand-off point.*

Parent: [[GitViz - Git Analytics and Evolution Visualizer]] · Siblings: PRDs for P2/P3/P4

---

## 1. Role Overview

| **What you own** | **Reading Git** (subprocess/GitPython), **REST API** (Endpoints + JSON shapes), **Import pipeline** (background ingest job) |
| **You share** | **Postgres schema** (P1 + P4) and **REST API shape** (P1 + P2), frozen Week 1 — never renegotiate without a team sync |
| **You do NOT own** | Metrics math, DB schema/migrations, UI, docs/demo — those are P2/P3/P4 |
| **Delivers** | `api/src/app.js`, `api/src/routes/`, `api/src/services/git_reader.js`, `api/src/services/ingest.js` |
| **Stack** | **Node.js (LTS)**, **Express**, `simple-git` or plain `child_process.execFile('git', …)`, `pg` (read-only for serving) |
| **Role numbering note** | The older `Development Plan.md` uses different numbering (P1=Backend, P2=Frontend, P3=QA, P4=Data) and Python/FastAPI. **Ignore it** — the newer individual PRDs (dated 2026-10-11) define P1=Backend Node.js/Express, P2=Data, P3=Frontend, P4=Product+QA. Follow the numbering here. |

---

## 2. Your Endpoints — Freeze Week 1

| **Endpoint** | **Request** | **Response** |
|---|---|---|
| `POST /api/v1/repos` | `{ path: "~/proj" }` | `{ repo_id, status: "ingesting" }` |
| `GET /api/v1/repos/:id/status` | — | `{ pct, commit_count }` |
| `GET /api/v1/repos/:id/commits` | `?cursor=&limit=` | `{ commits[], next_cursor }` ← **cursor, not offset** |
| `GET /api/v1/repos/:id/commits/:sha` | — | Commit detail + diff |
| `GET /api/v1/repos/:id/files/:path/history` | — | Ordered commits + diffs |
| `GET /api/v1/repos/:id/metrics/churn` | — | P2's numbers, your route |
| `GET /api/v1/repos/:id/metrics/bus-factor` | — | P2's numbers, your route |
| `GET /api/v1/repos/:id/export?format=json|csv` | — | P2's generator, your route |

> **P3 builds against a `mock/` folder of hand-written JSON matching this exactly.** When your endpoints go live, P3 flips one flag in `web/src/api/client.ts`. If P3 asks "what does X return?" twice, the contract is drifting — write it down in `docs/api.md`.

---

## 3. Week-by-Week Plan

| **Week** | **Your Job** |
|---|---|
| **W1** | Benchmark `simple-git` vs `isomorphic-git` vs plain `execFile` on our own repo (with P2). Freeze API shape with P3. Scaffold `api/` — Express app + one green health route + CI passing on an empty commit. |
| **W2** | `git log --numstat` parser → commit-graph JSON (sha, parents, author, date, message, is_merge, per-file +/-). Basic graph data P3 can draw. |
| **W3** | Import endpoint (POST path → background ingest job), status polling, cursor-based commit pagination. |
| **W4** | Commit detail + diff endpoint (`git show`), per-commit file list. |
| **W5** | File-history endpoint with rename detection (with P2). Surface history breaks honestly — P3 shows them in the UI. |
| **W6** | Metrics + export routes wired to P2's queries. Error handling + validation pass. |
| **W7** | Perf pass on P2's 50k benchmark repo — measure, record, report the real number. |
| **W8** | API freeze, `docs/api.md` final, demo support. |

---

## 4. Rules You Must Follow (the project's scars)

1. **ONE pass over history.** One `git log --numstat` spawn, parse everything, hand rows to P2 for a bulk insert. **Never loop commit-by-commit** — that's the "52 minutes for 2,681 commits" disaster (PyDriller, a Python tool). Same trap exists in Node.
2. **`git log --follow` is a hack.** It skips merge commits — Linus said so himself; one file showed 717 commits with it, 537 without. Use `git log -- <file>` with rename detection instead, and make the limitation visible.
3. **Spawn git safely.** `execFile('git', [...])` with an args array — never string-interpolate into a shell. Repo paths come from the user; treat them as hostile. **Read-only commands only**; never `checkout`/`reset`/anything that touches the target repo.
4. **Merge commits double-count.** Tag them (`is_merge`, `parents[]`) in your ingest rows and expose first-parent info — P2's time-to-merge depends on it.
5. **Cursors, not offsets** — offset pagination falls apart at 50k commits.
6. **One bulk INSERT transaction.** Never row-by-row inserts; batch the whole pass into one transaction.

---

## 5. Definition of Done (same bar as everyone)

1. Merged to `main` with CI green
2. Automated test covers the happy path **and** at least one weird case (use P4's fixture repos)
3. Documented in `docs/api.md`
4. P4's checklist item ticked on a real build
5. **Any performance claim backed by a measured number** — never "blazing fast"

---

## 6. What You Can Say You Built (report line)

> "Designed and built the REST API and the Git ingestion pipeline that turns any local `.git` folder into queryable data in one pass."

---

## 7. Dependencies & Handoffs

| **Depends on** | **From** | **Hand-off** |
|---|---|---|
| **Schema** | P1 + P4 (Week 1) | Postgres schema — P1 codes against it |
| **API contract** | P1 + P2 (Week 1) | REST endpoint shapes — P3 mocks against these |
| **Ingested data** | P1 → P2 | Parsed commit-graph JSON → P2 bulk-inserts into Postgres |
| **Metrics queries** | P2 → P1 | P1 wraps P2's queries in REST routes |

| **You depend on** | **From** |
|---|---|
| **Mock JSON** | P3 (Week 1–3) |
| **Fixtures** | P4 (test repos) |
| **Schema docs** | P4 (`docs/schema.md`) |

---

## 8. Next Steps (checklist)

- [ ] W1 benchmark: simple-git vs isomorphic-git vs plain execFile (with P2)
- [ ] W1: freeze REST API shape with P3 → write `docs/api.md`
- [ ] W1: scaffold `api/` (Express app + health route + CI)
- [ ] W2: numstat parser + commit-graph JSON
- [ ] W3: import + status + cursor pagination
- [ ] W4: commit detail + diff
- [ ] W5: file history with rename detection
- [ ] W6: metrics + export routes (queries from P2)
- [ ] W7: perf pass on the 50k benchmark repo
- [ ] W8: API freeze + docs

---

## 9. Risk Register (P1 owner)

| **Risk** | **Early warning** | **Mitigation** |
|---|---|---|
| Ingest too slow | Week 1 spike > 3 min | Fall back to plain `git log`, run as background job with progress bar |
| API drift (P3 builds wrong thing) | P3 asks "what does X return?" twice | Contract lives in `docs/api.md`, mock folder generated from it |
| Merge-commit double counting | Dashboard totals ≠ manual count | Tag `is_merge`, `parents[]` in ingest rows; expose first-parent info |
| Unsafe git subprocess | Repo path injection | `execFile` args array only; never shell-interpolate; read-only commands |

---

## 10. Related Notes

- [[GitViz - Git Analytics and Evolution Visualizer]]
- [[GitViz - Development Plan]] *(ignore the numbering/stack — follow this PRD's)*
- [[GitViz - P2 Data]] · [[GitViz - P3 Frontend]] · [[GitViz - P4 Product + QA]]
- [[GitViz - PRD - P2 Data]] · [[GitViz - PRD - P3 Frontend]] · [[GitViz - PRD - P4 Product + QA]]