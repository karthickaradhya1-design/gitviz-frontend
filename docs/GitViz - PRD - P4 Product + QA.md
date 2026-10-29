---
tags:
  - project/gitviz
  - prd
  - p4-qa
  - product
  - qa
type: prd
role: P4
status: planning
created: 2026-10-29
---

# GitViz — PRD: P4 Product + QA (non-coder)

> [!quote] One-Liner
> "Define 'done', break the tool before the examiner does, and cut every number we can't back up."

> *P4 owns quality, delivery honesty, and the demo. P4 does NOT write product code — and that's the point. The riskiest part of this project is overclaiming ("50k smooth!", "first ever!"). P4 runs the demo cold, breaks things before the examiner does, and cuts any claim we can't back with a measured number.*

Parent: [[GitViz - Git Analytics and Evolution Visualizer]] · Siblings: PRDs for P1/P2/P3

---

## 1. Role Overview

| **What you own** | **Manual test checklist**, **weekly weird-repo pass**, **bug reports + triage**, **demo outline + script**, **README + writeup**, **"known limitations" page**, **curated ignore-list suggestions** (P2 implements), **claim-checking for every slide** |
| **You share** | **Postgres schema** (P1 + P4) and **REST API shape** (P1 + P2), frozen Week 1 — you reference these, you don't design them |
| **You do NOT own** | Fix bugs (you report them, owners fix), write product features, make performance claims without a measured source |
| **Delivers** | `docs/` — README, demo script, limitations page, test checklist |
| **Stack** | Markdown, a checklist, the GitViz build itself, random weird public repos |
| **Role numbering note** | The older `Development Plan.md` uses different numbering (P1=Backend, P2=Frontend, P3=QA, P4=Data) and Python/FastAPI. **Ignore it** — the newer individual PRDs (dated 2026-10-11) define P1=Backend Node.js/Express, P2=Data, P3=Frontend, P4=Product+QA. Follow the numbering here. |

> **You don't write product code — and that's the point.** The riskiest part of this project is overclaiming ("50k smooth!", "first ever!"). You're the person who runs the demo cold, breaks things before the examiner does, and cuts any claim we can't back with a measured number.

---

## 2. Your Artifacts

| **Artifact** | **When** | **Content** |
|---|---|---|
| 1. **Manual test checklist** (draft W1) | W1 onward | Weird repos: empty repo, repo with no commits, binary files, huge history, renames, merge-heavy history, single author (bus factor = 1), lockfile noise, filenames with spaces/unicode, shallow clone |
| 2. **Demo script** (draft W1 outline, rehearse W8) | W1 → W8 | Load our class repo → show graph with branches/merges → click the most-churned file → reveal top-5 hotspots + bus-factor chart → side-by-side with GitHub Insights ("they show per-person totals, we show per-file risk") |
| 3. **Known-limitations page** (living document) | W1 → W8 | Copied honestly from the parent note's "Problems That Cannot Be Solved" list. A report that names its own limits looks stronger, not weaker. |
| 4. **Weekly weird-repo pass** (every Friday, 30 min) | W2 → W7 | Point the current build at a random weird public repo, fill the limitations table, file bugs, mark release-blocking or not. |

---

## 3. Your Weekly Rhythm (Weeks 2–7)

- **Daily:** read the 3-line async updates; chase anyone blocked for more than a day.
- **Friday, 1 hour:** weird-repo pass (you) → whatever breaks becomes next week's first task.
- **Merge rule you enforce:** tests green (CI) + a checklist item ticked — no tick, no merge.

---

## 4. Prepared Answers (memorize these — judges will try them)

| Judge says | You answer |
|---|---|
| "CodeScene already does this" | "It does — for €18–27/person/month, closed-source. We're free, open, and run on your own machine. We build the combination, not the metric." |
| "AI can explain codebases now" | "Different job. AI answers *what does this code do?* We answer *across the whole history, which files are risky, who owns what, how did this file evolve?* — numbers computed from git, not guessed prose." |
| "You're not first" | "We claim the combination, never 'first ever.' We searched: no well-known free local tool does all of it together today." |
| "Will these files break?" | "Churn *correlates* with bugs — we rank where to look. The dashboard says 'hotspot — inspect this,' not 'this will fail.'" |

---

## 5. Week-by-Week Plan

| **Week** | **Your Job** |
|---|---|
| **W1** | Draft the manual test checklist + demo outline + limitations draft. Agree the checklist with everyone — it's the definition of done. |
| **W2** | Friday weird-repo pass #1. Triage bugs by owner. |
| **W3** | Friday pass #2 — try our own class repo for the first time. Check P2's numbers against a manual `git log --shortstat` count for one file. |
| **W4** | Friday pass #3. First cold run of the demo script on the graph. |
| **W5** | Friday pass #4 (focus: file evolution + renames). |
| **W6** | Friday pass #5 (focus: dashboard numbers + lockfile ignore list suggestions for P2). |
| **W7** | **Honesty week.** Get P2/P3's measured 50k number — whatever it is (10k? 30k?), it goes on the slides. Scan every claim: no "first ever" (we claim *the combination*, never first), no "blazing", no unmeasured numbers. |
| **W8** | ★ Demo rehearsal ×3 cold. Final regression pass against the checklist. Sign-off. Own the slide deck; cross-check every number with P2. |

---

## 6. Definition of Done (your bar)

A feature is done only when **all five** are true (same bar as everyone, P3 owns the checklist):

1. Code merged to `main` with CI green
2. Automated test covers the happy path **and** at least one weird case
3. Documented in README / `docs/api.md`
4. **P3's checklist item ticked on a real build**
5. Any performance or "first ever" claim on screen backed by a measured number

Plus your personal must-haves:

- Manual test checklist covers at least 8 weird-repo scenarios
- Demo script rehearsed ×3 cold runs
- Known-limitations page is living and up-to-date
- Every number on the slide deck has a verified source

---

## 7. What You Can Say You Built (report line)

> "Owned QA and delivery — the manual test checklist, the weekly weird-repo pass, the demo, and the honesty check behind every number we published."

---

## 8. Dependencies & Handoffs

| **Depends on** | **From** | **Hand-off** |
|---|---|---|
| **API contract** | P1 + P2 (Week 1) | Reference `docs/api.md` and `docs/schema.md` for test scenarios |
| **Schema knowledge** | P1 + P4 (Week 1) | Understanding what data each endpoint returns; building test fixtures |
| **Build artifact** | P1/P2/P3 (W3+) | The running GitViz instance — you test against it every Friday |
| **Mock JSON** | P3 (Week 1–3) | Your test checklist references the mock API shapes |

| **You depend on** | **From** |
|---|---|
| **Running build** | P1/P2/P3 (throughout) — the app must be runnable for your Friday tests |
| **Fixtures** | P4 (test repos with edge cases) |
| **50k benchmark number** | P2/P3 (Week 7) — P4 collects and validates it for the slides |

---

## 9. Next Steps (checklist)

- [ ] W1: draft manual test checklist (weird repos list above)
- [ ] W1: draft demo outline + limitations page from the parent note
- [ ] W1: get the whole team to agree the checklist = definition of done
- [ ] Set up the Friday weird-repo ritual on the team calendar
- [ ] W3: manually reconcile P2's churn number for one file
- [ ] W7: collect the measured 50k number + claim-scan every slide
- [ ] W8: demo rehearsal ×3 + final sign-off

---

## 10. Risk Register (P4 owner)

| **Risk** | **Early warning** | **Mitigation** |
|---|---|---|
| Non-coder feels useless mid-project | P4 has nothing to do until week 8 | Give P4 real work from week 1: test checklist, trying GitViz on weird repos every Friday, maintaining README/limitations, preparing the demo script. QA on unfinished builds = early bug discovery. |
| Overclaiming on slides | Adjective like "first" or "blazing" appears on screen | Every number needs a source; P4 cuts anything unbacked; "known limitations" page must name its own limits honestly |
| Demo script stalls | Can't build or run the tool | P4's Friday weird-repo pass starts W2; if the build is broken, P3/P1 fix it before P4 wastes time |
| Scope creep | New feature PR in W6–7 | Only the 5 MVP features; rest goes to the "later" list; P3 enforces the merge rule (checklist item ticked) |
| Free hosting sleeps mid-demo | Render free tier sleeps after 15 min idle | **Run the demo locally on a laptop.** Hosting is optional and never needed for the pitch. |

---

## 11. Related Notes

- [[GitViz - Git Analytics and Evolution Visualizer]]
- [[GitViz - Development Plan]] *(ignore the numbering/stack — follow this PRD's)*
- [[GitViz - P1 Backend]] · [[GitViz - P2 Data]] · [[GitViz - P3 Frontend]]
- [[GitViz - PRD - P1 Backend]] · [[GitViz - PRD - P2 Data]] · [[GitViz - PRD - P3 Frontend]]