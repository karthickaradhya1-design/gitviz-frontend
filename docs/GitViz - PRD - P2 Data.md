---
tags:
  - project/gitviz
  - prd
  - p2-data
  - nodejs
  - postgresql
type: prd
role: P2
status: planning
created: 2026-10-29
---

# GitViz — PRD: P2 Data (Node.js + Postgres)

> [!quote] One-Liner
> "Store every commit once, compute churn / bus factor / time-to-merge with honest SQL, and make the numbers on screen reconcile with a manual count."

> *P2 owns the numbers side: storing parsed Git data and computing metrics. P1 owns the input side (reading Git). The frozen Postgres schema (Week 1) is the only hand-off point.*

Parent: [[GitViz - Git Analytics and Evolution Visualizer]] · Siblings: PRDs for P1/P3/P4

---

## 1. Role Overview

| **What you own** | **Postgres schema + migrations**, **bulk ingest path**, **metrics engine** (churn, bus factor, time-to-merge), **snapshot export** (JSON/CSV), **ignore-list config** |
| **You share** | **Postgres schema** (P1 + P4) and **REST API shape** (P1 + P2), frozen Week 1 — never change without telling everyone |
| **You do NOT own** | Git parsing (P1), UI (P3), docs/demo (P4) |
| **Delivers** | `api/src/db/` (schema, migrations, query helpers), `api/src/services/metrics.js`, export generator, ignore-list config |
| **Stack** | **Node.js (LTS)**, **PostgreSQL**, `pg` (node-postgres), plain-SQL migrations via node-pg-migrate *or* dbmate (pick in W1, both $0) |
| **Role numbering note** | The older `Development Plan.md` uses different numbering (P1=Backend, P2=Frontend, P3=QA, P4=Data) and Python/FastAPI. **Ignore it** — the newer individual PRDs (dated 2026-10-11) define P1=Backend Node.js/Express, P2=Data, P3=Frontend, P4=Product+QA. Follow the numbering here. |

---

## 2. The Schema — Freeze Week 1

```text
repos        (id, path, name, default_branch, ingested_at, commit_count)
authors      (id, repo_id, name, email, commits)
commits      (id, repo_id, sha, author_id, parents[], committed_at, message, is_merge)
file_changes (id, commit_id, repo_id, path, old_path,   ← old_path = rename detection
              additions, deletions, is_binary, is_generated)
metrics      (repo_id, path, churn_commits, churn_lines, last_touch_at, computed_at)
author_stats (repo_id, author_id, path, commits, lines_added)   ← feeds bus factor
```

Write it in `docs/schema.md`. **P1 codes against it; P3's fixtures test it; you never change it without telling everyone.**

---

## 3. Week-by-Week Plan

| **Week** | **Your Job** |
|---|---|
| **W1** | **Spike (half a day):** time `git log --numstat` on a ~50k-commit public repo — under 3 minutes = we're good, over = tell the team immediately. Freeze schema with P1. Scaffold `db/` + migrations running in CI. |
| **W2** | Bulk-insert path (P1 hands you parsed rows → one transaction, batched). Metrics engine skeleton. |
| **W3** | Churn (per-file commit count + lines added/deleted), commits-per-author. Fill the schema with our own repo's real data. |
| **W4** | DB perf: indices, EXPLAIN plans on 50k-commit data. Keep import under the W1 spike number. |
| **W5** | Bus factor per module/file + file-history queries (pair with P3 on the timeline view). |
| **W6** | Dashboard queries (top-10 churn, churn over time), export generator (JSON/CSV), default generated-file ignore list — editable by the user. |
| **W7** | Query perf on the 50k benchmark repo (with P3's number for the frontend). Help P3 tell the truth on the slides. |
| **W8** | Verify every number P4 puts on the slides against the DB. Demo support. |

---

## 4. Rules You Must Follow (the project's scars)

1. **One `git log --numstat` pass + one bulk INSERT transaction.** Never row-by-row inserts, never commit-by-commit walks. This is the whole reason we're fast.
2. **Merge commits mess up the numbers.** Compute time-to-merge only along the first-parent branch. Decide once (Week 1) whether merges count toward churn — write it down and tell P3, whose tooltip must say it out loud.
3. **Bus factor is an estimate, not mind-reading.** It measures *concentration of commits*, not concentration of knowledge. Label every score "estimate" in what you serve to P3.
4. **Renames:** store git's detected `old_path`. When the chain breaks, keep the break visible — honesty beats a fake-perfect history.
5. **Ignore list on by default:** `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `dist/`, `build/`, `node_modules/`, `*.min.*`, `go.sum`, `Cargo.lock` — user-editable, curated with P4. Otherwise the top-10 hotspot chart is just lockfiles.
6. **One transaction only.** The entire bulk insert must be one Postgres transaction. No autocommit per row.

---

## 5. Definition of Done (same bar as everyone)

1. Merged to `main` with CI green
2. Automated test covers the happy path **and** at least one weird case (merge-heavy repo, single-author repo → bus factor = 1)
3. Documented in `docs/schema.md`
4. P4's checklist item ticked on a real build
5. **Any performance claim backed by a measured number** — never "blazing fast"

---

## 6. What You Can Say You Built (report line)

> "Designed the PostgreSQL schema and the metrics engine (churn, bus factor, time-to-merge) behind the dashboard, plus the snapshot export."

---

## 7. Dependencies & Handoffs

| **Depends on** | **From** | **Hand-off** |
|---|---|---|
| **Parsed rows** | P1 (Week 2+) | `git log --numstat` → rows JSON — P1 hands off one bulk insert |
| **API route shapes** | P1 + P2 (Week 1) | P1's endpoint shapes — P2 wires queries to them |
| **Schema** | P1 (Week 1) | Postgres schema — P1 codes against it; P3's fixtures test it |

| **You depend on** | **From** |
|---|---|
| **Fixtures** | P4 (test repos with edge cases) |
| **Mock JSON** | P3 (Week 1–3, for API contract) |
| **Ingest data** | P1 (parsed commit graph) |

---

## 8. Next Steps (checklist)

- [ ] W1 spike: time `git log --numstat` on a ~50k-commit public repo
- [ ] W1: benchmark git libraries with P1 (same repo)
- [ ] W1: freeze schema with P1 → write `docs/schema.md`
- [ ] W1: pick migration tool (node-pg-migrate vs dbmate) + scaffold `db/` + CI
- [ ] W2: bulk-insert path (one transaction, batched)
- [ ] W3: churn + commits-per-author on our own repo
- [ ] W4: indices + EXPLAIN pass at 50k
- [ ] W5: bus factor + file-history queries
- [ ] W6: dashboard queries + export + ignore list
- [ ] W7: query perf, honest numbers for slides
- [ ] W8: verify every slide number against the DB

---

## 9. Risk Register (P2 owner)

| **Risk** | **Early warning** | **Mitigation** |
|---|---|---|
| Ingest too slow | Week 1 spike > 3 min | Fall back to plain `git log`, run as background job with progress bar |
| API drift (P1 changes endpoint shapes) | P1 changes endpoint without updating schema | Shared schema lives in `docs/schema.md`; any change requires team sync |
| Merge commits double-counting | Dashboard totals ≠ manual count | Compute time-to-merge only along first-parent; label merge handling in UI tooltip |
| Lockfiles pollute hotspots | Top-10 = `package-lock.json` etc. | Default ignore list (see rule #5); editable by user; curate with P4 |
| Bus factor misuse | Score treated as certainty, not estimate | Always label "estimate (concentration of commits)" in served data |

---

## 10. Related Notes

- [[GitViz - Git Analytics and Evolution Visualizer]]
- [[GitViz - Development Plan]] *(ignore the numbering/stack — follow this PRD's)*
- [[GitViz - P1 Backend]] · [[GitViz - P3 Frontend]] · [[GitViz - P4 Product + QA]]
- [[GitViz - PRD - P1 Backend]] · [[GitViz - PRD - P3 Frontend]] · [[GitViz - PRD - P4 Product + QA]]