---
tags:
  - project/gitviz
  - prd
  - p3-frontend
  - react
  - vite
type: prd
role: P3
status: planning
created: 2026-10-29
---

# GitViz — PRD: P3 Frontend (React + Vite)

> [!quote] One-Liner
> "Turn JSON into a commit graph, a file's life story, and a dashboard a human understands in ten seconds — smooth at thousands of commits, honest about the limit."

> *P3 owns the UI: turning the frozen API contract into human-readable views. P3 never guesses the API — builds against a `mock/` folder, then flips one flag in `client.ts` when P1's endpoints go live.*

Parent: [[GitViz - Git Analytics and Evolution Visualizer]] · Siblings: PRDs for P1/P2/P4

---

## 1. Role Overview

| **What you own** | **All UI** — Commit graph (DAG), file evolution view, health dashboard, export button, honest limitation labels in the UI |
| **You share** | **REST API shape** (P1 + P2), frozen Week 1 — build against `mock/` JSON first; flip flag in `client.ts` when live |
| **You do NOT own** | Git parsing, metrics math, DB queries, API design — you consume the frozen contract |
| **Delivers** | `web/` — the entire folder; `src/api/client.ts` (the only file that knows URLs), `src/views/`, `src/components/` |
| **Stack** | **React + Vite**, recharts for charts, an existing graph-drawing lib first (custom canvas only if week 7 has spare time), virtualized rendering, one API client (`src/api/client.ts` + react-query) |
| **Role numbering note** | The older `Development Plan.md` uses different numbering (P1=Backend, P2=Frontend, P3=QA, P4=Data) and Python/FastAPI. **Ignore it** — the newer individual PRDs (dated 2026-10-11) define P1=Backend Node.js/Express, P2=Data, P3=Frontend, P4=Product+QA. Follow the numbering here. |

---

## 2. The Three Screens — Design Against Mocks Week 1

| **#** | **Screen** | **Ship Gate** |
|---|---|---|
| 1 | **Commit graph** — lanes, branches, merges, click for details | Renders 1k commits < 1s, lanes never overlap on merge-heavy history |
| 2 | **File evolution** — pick a file → ordered timeline of every commit that touched it + diff preview | Rename breaks shown honestly in UI |
| 3 | **Health dashboard** — top-10 churn, bus-factor score (labeled "estimate"), commits per author, churn over time | Numbers reconcile with P2's manual count |
| 4 | **Export button** — calls P1's export route, P2's generator | — |

> **Never hand-code lane drawing.** Getting branch lines to never overlap is NP-hard in general — use an existing graph lib's heuristics. Custom drawing only if week 7 has spare time.

> **Show limitations in the UI.** File history after an undetectable rename → visible break. Bus factor → "estimate (concentration of commits)". Churn → "hotspot — inspect this", never "this will break" (churn correlates with bugs, it doesn't predict them).

> **The browser never touches Git or Postgres.** Everything goes through `client.ts`. That single choke point is why the contract was worth freezing.

> **Tooltips must say whether merge commits count** toward churn — P2 decides in Week 1; you write it in the UI.

---

## 3. Week-by-Week Plan

| **Week** | **Your Job** |
|---|---|
| **W1** | Freeze API shape with P1. Design all three screens against mock JSON — clickable layout, empty states, error states. |
| **W2** | `client.ts` (the only file that knows URLs), routing, layout shell. Build against mocks. |
| **W3** | Screens against mocks + verify the flip to live API works end to end. |
| **W4** | ★ Commit graph on real data — the first "it's real" moment. |
| **W5** | ★ File evolution view (pair with P2 on history queries). |
| **W6** | ★ Health dashboard + charts + export button (pair with P2). |
| **W7** | Virtualized rendering (only draw what's on screen) + the honest 50k test with P2's numbers. No new features. |
| **W8** | Demo polish — the graph is the money shot; rehearse it until it never stutters. |

---

## 4. Rules You Must Follow (the project's scars)

1. **Browsers choke after ~10,000 nodes.** Virtualize from day one — render only what's visible. Promise "thousands, smooth" and never more than P2 measured. GitHub itself gave up above 10k; we don't pretend we're smarter.
2. **Don't hand-code lane drawing.** Getting branch lines to never overlap is NP-hard in general — use an existing graph lib's heuristics. Custom drawing only if week 7 has spare time.
3. **Show limitations in the UI.** File history after an undetectable rename → visible break. Bus factor → "estimate (concentration of commits)". Churn → "hotspot — inspect this", never "this will break" (churn correlates with bugs, it doesn't predict them).
4. **The browser never touches Git or Postgres.** Everything goes through `client.ts`. That single choke point is why the contract was worth freezing.
5. **Tooltips must say whether merge commits count** toward churn — P2 decides in Week 1; you write it in the UI.
6. **Promise "thousands, smooth"** — never promise "10k smooth" or "50k smooth" without measured data.

---

## 5. Definition of Done (same bar as everyone)

1. Merged to `main` with CI green (vitest + build)
2. Automated test covers the happy path **and** at least one weird case (empty state, huge history, missing data)
3. Documented in `docs/` (screens + how to run locally)
4. P4's checklist item ticked on a real build
5. **Any performance claim on screen backed by a measured number** — never "buttery smooth"

---

## 6. What You Can Say You Built (report line)

> "Built the entire React frontend — a virtualized interactive commit DAG, file evolution timeline, and health dashboard rendering 10k commits."

---

## 7. Dependencies & Handoffs

| **Depends on** | **From** | **Hand-off** |
|---|---|---|
| **API contract (mock JSON)** | P1 + P2 (Week 1) | `mock/` folder of hand-written JSON matching the frozen REST API shape exactly |
| **API flag flip** | P1 (Week 3+) | One flag in `client.ts` — when endpoints go live, flip from mock to real |
| **Schema knowledge** | P1 + P4 (Week 1) | Understanding what data each endpoint returns |
| **Metrics numbers** | P2 (Week 5+) | Churn, bus factor, time-to-merge values served by P1's routes |

| **You depend on** | **From** |
|---|---|
| **Fixtures** | P4 (weird-repo test repos) |
| **Mock JSON** | P3's own `mock/` folder (Week 1–3) |
| **API docs** | `docs/api.md` (P1 + P2) |

---

## 8. Next Steps (checklist)

- [ ] W1: freeze REST API shape with P1
- [ ] W1: three screens designed against mock JSON (incl. empty + error states)
- [ ] W2: `client.ts` + routing + layout shell
- [ ] W3: mocks verified against live API, flag-flip works
- [ ] W4: commit graph on real data
- [ ] W5: file evolution view
- [ ] W6: health dashboard + charts + export button
- [ ] W7: virtualized rendering + honest 50k test
- [ ] W8: demo polish + rehearsal

---

## 9. Risk Register (P3 owner)

| **Risk** | **Early warning** | **Mitigation** |
|---|---|---|
| Frontend freezes on big history | FPS drops in W4 test | Virtualize from day 1; never promise beyond measured; use react-virtualized or similar |
| API drift (P1 changes endpoint shapes) | P3 spends day wondering "what does X return?" | Contract lives in `docs/api.md`; mock folder generated from it; P3 flips one flag |
| Drawing graph overlaps | Lanes overlap on merge-heavy history | Use existing graph-drawing lib heuristics; don't hand-code; accept some overlap is NP-hard |
| Browser chokes at 10k+ nodes | FPS < 60 in graph view | Virtualized rendering from day 1; only draw visible nodes; limit promised range |

---

## 10. Related Notes

- [[GitViz - Git Analytics and Evolution Visualizer]]
- [[GitViz - Development Plan]] *(ignore the numbering/stack — follow this PRD's)*
- [[GitViz - P1 Backend]] · [[GitViz - P2 Data]] · [[GitViz - P4 Product + QA]]
- [[GitViz - PRD - P1 Backend]] · [[GitViz - PRD - P2 Data]] · [[GitViz - PRD - P4 Product + QA]]