# GitViz Frontend QA Checklist & Verification Guide

This document is the manual QA verification suite for the GitViz frontend (React 18 + Vite + TypeScript), prepared for **P4 Product + QA**.

---

## 1. Page-by-Page Manual Test Checklist

Every check in this section must pass in **both Light and Dark themes**, with keyboard navigation only (Tab, Shift+Tab, Enter, Space, Escape), and at both a desktop viewport (1280px) and a narrow mobile viewport (360px).

### 1.1 Home (`/`)

| # | Test Scenario | Steps | Expected Result | Pass? |
|---|---------------|-------|-----------------|-------|
| 1 | **Skip Link** | Focus the page with Tab on fresh load | First focusable item is "Skip to main content". Hitting Enter jumps focus directly to `main#main-content`. | [ ] |
| 2 | **Responsive Layout (360px)** | Resize viewport to 360px | No horizontal overflow. Hero headline wraps cleanly; CTA buttons stack vertically; trust items stack cleanly. | [ ] |
| 3 | **Theme Switching** | Click Theme Toggle in header (or press Enter when focused) | `data-theme="dark"` / `data-theme="light"` toggles on `<html>`. Card backgrounds, borders, typography, and SVG illustrations adapt instantly without flickering. | [ ] |
| 4 | **Hero Navigation Links** | Tab to "Open Commit Graph" and "View Dashboard" buttons | Focus ring is clearly visible (cyan glow, 2px outline with offset). Pressing Enter routes to `/graph` or `/dashboard`. | [ ] |
| 5 | **Code Snippet Copy** | Navigate to the "How it works" section, click or trigger the "Copy" button on `~/projects/my-repo` | Button swaps to "Copied" with check icon for 2 seconds. Screen reader announces via `aria-live="polite"`. | [ ] |
| 6 | **Feature Card Deep Links** | Tab through the 3 feature cards | Hover/focus raises card with cyan glow. Clicking card navigates to `/graph`, `/files`, and `/dashboard` respectively. | [ ] |
| 7 | **Honesty Copy Verification** | Inspect trust cards and footer disclaimers | Text explicitly states: "Runs locally", "Read-only: GitViz never changes your repository", "Ignored by default: lockfiles and build folders". No buzzwords ("blazing", "revolutionary"). | [ ] |

---

### 1.2 Commit Graph (`/graph`)

| # | Test Scenario | Steps | Expected Result | Pass? |
|---|---------------|-------|-----------------|-------|
| 1 | **Virtualized List Rendering** | Scroll through the commit list | Only rows in the active viewport (plus small overscan buffer) are rendered in the DOM. Row heights remain fixed at 44px; scrolling is smooth without layout shift. | [ ] |
| 2 | **Keyboard Navigation in List** | Tab to the commit list and use Arrow Up / Arrow Down / Enter | Focus moves between commits; Enter selects a commit. Selected commit is highlighted with a blue border/surface accent. | [ ] |
| 3 | **Commit Details Panel** | Select any commit (e.g. `feat(parser): add single-pass git log parser`) | Detail panel opens on the right (or modal/drawer on 360px mobile). Displays full commit message, author name & email, ISO date, commit SHA with Copy button, parent SHA links, and stats. | [ ] |
| 4 | **Parent SHA Navigation** | In Details panel, click a Parent SHA chip | Focus and selection jump to the parent commit in the list. Viewport scrolls if required to bring row into view. | [ ] |
| 5 | **Filter Toolbar** | Type a query into "Filter by message or SHA..." or pick author/branch | Filtered count updates live (`X of Y commits`). Graph gutter displays an informative notice: *"Filters are on, so the graph lines are hidden. Reset filters to see branches and merges."* | [ ] |
| 6 | **Reset Filters** | Click "Reset filters" button in toolbar or in notice banner | Search query and dropdowns reset to default; graph lanes and merge curves reappear immediately. | [ ] |
| 7 | **State Override: Loading** | Navigate to `/graph?state=loading` | LoadingSkeleton with 8 skeleton rows renders. Toolbar and commit list are disabled/inert. | [ ] |
| 8 | **State Override: Empty** | Navigate to `/graph?state=empty` | EmptyState component renders: *"No commits to show"* with description and a CTA button to navigate home. | [ ] |
| 9 | **State Override: Error** | Navigate to `/graph?state=error` | ErrorState renders with retry button: *"Could not load commits. The API did not respond."* Clicking Retry attempts refetch. | [ ] |

---

### 1.3 File Evolution (`/files`)

| # | Test Scenario | Steps | Expected Result | Pass? |
|---|---------------|-------|-----------------|-------|
| 1 | **File Selection via Picker** | Select a file from the sidebar list (or search in the input) | Selected file is highlighted. URL updates with `?path=<filepath>`. Header updates to display the file name. | [ ] |
| 2 | **Timeline Chronology** | Inspect the ordered commit timeline for the selected file | Commits are listed chronologically newest-first. Each card shows author avatar/initials, date, message, additions/deletions badge, and commit SHA. | [ ] |
| 3 | **Unified Diff Preview** | Click "Inspect diff" on a commit card | Diff block expands inline using monospace font with syntax coloring (`+` lines in green, `-` lines in red). Clicking "Hide changes" collapses it. | [ ] |
| 4 | **Rename Break Indicator** | Select a file with a rename gap (e.g., `src/core/router.ts`) | A dashed warning spine and amber card appear: *"History break: rename detection cutoff"*. | [ ] |
| 5 | **"Why did Git lose track?"** | Click the expandable toggle on the history break card | An educational explanation expands explaining Git's content-similarity threshold, Linus Torvalds' caveat, and GitViz's honesty rule. | [ ] |
| 6 | **Merge Commits Toggle** | Uncheck "Show merge commits" in timeline header | Merge commits are filtered out. If all commits touching the file were merges, an EmptyState appears with an action to re-enable merges. | [ ] |
| 7 | **Mobile Drawer (360px)** | View `/files` on 360px viewport, tap "Select file" button | File picker opens as an overlay drawer. Selecting a file loads timeline and automatically closes drawer. | [ ] |
| 8 | **State Overrides** | Test `/files?state=loading`, `/files?state=empty`, `/files?state=error` | Each state displays the corresponding state component cleanly without crashing or overlapping. | [ ] |

---

### 1.4 Health Dashboard (`/dashboard`)

| # | Test Scenario | Steps | Expected Result | Pass? |
|---|---------------|-------|-----------------|-------|
| 1 | **Summary Stat Cards** | View the top 4 stat cards | Total Commits, Authors, Active Period, and Bus Factor render with crisp labels and icons. Bus Factor displays a yellow/warning `estimate` pill. | [ ] |
| 2 | **Top Churn Chart / Table** | Toggle between "Chart" and "Table" view modes | Chart renders horizontal bars with hotspot highlights for top 3 files. Table renders sortable columns with direct links to `/files?path=...`. | [ ] |
| 3 | **Metric Switch** | Toggle between "Commits" and "Lines changed" in Top Churn | Bar chart and table re-sort and re-label values according to the selected metric. | [ ] |
| 4 | **Bus Factor Panel** | Inspect Bus Factor score and module breakdown | Shows large numeric score, risk classification badge (`Concentrated`, `Moderate`, `Spread`), and per-module ownership bars. | [ ] |
| 5 | **Authors & Churn Over Time** | Inspect bottom charts (Authors bar chart, Churn time line chart) | Recharts components render responsive SVG charts. Hovering over bars or points renders a custom dark-mode styled tooltip with exact counts. | [ ] |
| 6 | **Export Dropdown** | Click "Export", then choose "Export JSON" and "Export CSV" | Triggers immediate client-side download of `gitviz-<repo>-metrics.json` and `gitviz-<repo>-churn.csv`. | [ ] |
| 7 | **Honesty Notes Card** | Inspect the "Metric Assumptions & Limitations" card | Explicitly states whether merge commits were counted, notes that hotspots guide attention rather than predict defects, and chips the default ignored patterns (`node_modules/**`, `dist/**`, `package-lock.json`, etc.). | [ ] |
| 8 | **State Overrides** | Test `/dashboard?state=loading`, `/dashboard?state=empty`, `/dashboard?state=error` | Skeleton grid, empty repository prompt, and error recovery screen render appropriately. | [ ] |

---

### 1.5 About & Limitations (`/about`)

| # | Test Scenario | Steps | Expected Result | Pass? |
|---|---------------|-------|-----------------|-------|
| 1 | **Table of Contents Navigation**| Click each link in the left-hand TOC (Project Overview, Known Limitations, FAQ, Architecture & Privacy, Team) | Page smoothly scrolls to the corresponding section. The active TOC link receives an accent border. | [ ] |
| 2 | **Anchor Hash Deep Linking** | Navigate directly to `/about#bus-factor-estimate` or `/about#renames` | Page scrolls to the specific limitation card and temporarily flashes a cyan highlight border. | [ ] |
| 3 | **Limitation Category Filters**| Click filter pills: "All", "Git History", "Metrics & Churn", "Performance", "Graph Layout" | Filter counts update; limitation list filters instantly to matching cards with zero layout shift. | [ ] |
| 4 | **Interactive FAQ Accordion** | Click each FAQ question (e.g., *"Doesn't CodeScene already do this?"*, *"Can't AI just explain a codebase?"*) | Accordion opens smoothly, setting `aria-expanded="true"`. Answers strictly match the prepared answers from P4 PRD. | [ ] |
| 5 | **Architecture & Privacy** | Verify the 3 privacy cards | Confirms local execution, read-only Git operations, and zero outbound network telemetry. | [ ] |
| 6 | **Narrow Viewport (360px)** | Resize to 360px | Sticky TOC switches to top horizontal pill bar or hides cleanly; cards, badges, and FAQ items remain fully readable. | [ ] |

---

### 1.6 Design System Showcase (`/design-system`)

| # | Test Scenario | Steps | Expected Result | Pass? |
|---|---------------|-------|-----------------|-------|
| 1 | **Color Swatches** | Review Base Palette, Semantic Colors, and Graph Lanes | Swatches display token name, hex value, and sample swatch. Contrast is legible in both Light and Dark themes. | [ ] |
| 2 | **Typography Hierarchy** | Inspect Heading 1 through Body Small and Monospace | JetBrains Mono renders for commit SHAs, file paths, and code snippets; Inter renders for UI text. | [ ] |
| 3 | **Button Variants & Sizes** | Test Primary, Secondary, Ghost buttons in md and lg sizes | Hover and focus states work properly. Icon alignment is centered with 8px gap. | [ ] |
| 4 | **Badge Variants** | Check Neutral, Info, Success, Warning, Danger badges | Badges have rounded pill shape, 11px font, and compliant WCAG AA contrast against their backgrounds. | [ ] |
| 5 | **Cards & State Previews** | Review Card, LoadingSkeleton, EmptyState, and ErrorState | Components render as isolated previews matching production appearance. | [ ] |

---

### 1.7 404 Not Found (`/*`)

| # | Test Scenario | Steps | Expected Result | Pass? |
|---|---------------|-------|-----------------|-------|
| 1 | **Unknown Path Display** | Navigate to `/this-page-does-not-exist` | Page renders large "404" badge and displays the exact path `/this-page-does-not-exist` inside a code chip. | [ ] |
| 2 | **Helpful Recovery Links** | Inspect the suggested navigation shortcuts | Links to "Commit Graph", "File Evolution", "Health Dashboard", and "Home" are keyboard-navigable and route correctly. | [ ] |
| 3 | **Document Title** | Check browser tab title | Displays `Not Found | GitViz`. Focus shifts to page heading on load. | [ ] |

---

### 1.8 Load Repository Page (`/load`)

| # | Test Scenario | Steps | Expected Result | Pass? |
|---|---------------|-------|-----------------|-------|
| 1 | **Empty Path Validation** | Clear input and click "Start import" | Inline error appears: *"Repository path is required."* Input receives `aria-invalid="true"` and keyboard focus. | [ ] |
| 2 | **Whitespace-only Path** | Enter spaces `   ` and click "Start import" | Inline error appears: *"Repository path is required."* Backend request is not fired. | [ ] |
| 3 | **Control Characters & Newlines** | Paste input with line breaks or control chars | Inline error appears: *"Path contains invalid control characters or line breaks."* | [ ] |
| 4 | **Spaces & Unicode in Path** | Enter `C:\projects\my cool repo` or `~/dossiers/développement` | Path is accepted as valid client input and forwarded strictly as text to API. | [ ] |
| 5 | **Validation Error Demo (`/does/not/exist`)** | Enter `/does/not/exist` in mock mode and submit | Backend error alert appears (`role="alert"`): *"Path not found or not a Git repository"* with a "Try again" action button. No stack trace. | [ ] |
| 6 | **Mock Error Switch (`?state=error`)** | Navigate to `/load?state=error` and submit valid path | API creation failure is simulated; error alert appears with retry option. | [ ] |
| 7 | **Mock Ingestion Error (`?state=import-error`)** | Navigate to `/load?state=import-error` and submit valid path | Progress increments to ~60%, then displays error card with message and safe note: *"Your repository was not changed."* | [ ] |
| 8 | **Progress Bar Accessibility** | Inspect determinate progress bar during import | `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`. Screen reader announcements fire only at 25%, 50%, 75%, and 100% milestones via `aria-live="polite"`. | [ ] |
| 9 | **Refresh While Ingesting** | Refresh browser while import status is "ingesting" | Page re-reads repo from `localStorage` and resumes polling cleanly without layout flash or console errors until done. | [ ] |
| 10 | **Responsive & Themes (360px)** | Test in both light and dark themes at 360px viewport | Form and What Happens cards stack vertically; progress bar and milestone list fit without horizontal scrolling. | [ ] |

---

## 2. Weird Data to Try Once Backend is Live

When P1 (Backend) and P2 (Data Engine) connect to real repositories, execute the following stress-test scenarios:

| # | Edge Case | Test Repository / Configuration | What to Verify in Frontend |
|---|-----------|----------------------------------|----------------------------|
| 1 | **Empty Repository** | `git init empty-repo` (0 commits) | App does not crash. Displays `EmptyState` ("No commits to show") on `/graph`, `/files`, and `/dashboard`. |
| 2 | **Single Author Repo** | Personal hobby repo with 1 contributor | Bus factor shows score `1` with message: *"Only one author found. Bus factor is 1 by definition."* |
| 3 | **Binary Files** | Repo with images, PDFs, `.wasm`, `.zip` | File evolution handles binary files gracefully without displaying corrupted diff text; shows file size or binary notice. |
| 4 | **Very Long File Paths** | Deeply nested path (> 260 characters, e.g. `src/modules/submodule/infrastructure/adapters/internal/v2/deeply/nested/implementation/file.ts`) | Middle-truncation utility (`truncateMiddle`) kicks in; breadcrumbs do not break table layout or overflow horizontally. |
| 5 | **Spaces & Special Chars** | Files like `my cool script #1.ts`, `data (v2) [final].json`, `résumé.pdf` | URL search param is properly encoded (`encodeURIComponent`); diff loader fetches correctly without 400 Bad Request. |
| 6 | **Unicode in Metadata** | Author names with accents (e.g., `Hélène Müller`), Cyrillic, CJK (`田中 太郎`), or emojis in commit messages (`🚀 initial release`) | Renders UTF-8 characters cleanly; avatar initials utility extracts first 2 letters without throwing exceptions. |
| 7 | **Merge-Heavy History** | Linux kernel, Git repo, or octopus-merge heavy repos | Greedy branch lane layout does not freeze the browser. Legend notes: *"Some overlap may occur on very merge-heavy histories."* |
| 8 | **File Renamed 5+ Times** | File moved through multiple directories across project lifecycle | Each rename is tracked or honestly broken. Each rename badge displays previous path without visual overlap. |
| 9 | **Single Commit Repo** | Repository with exactly 1 initial commit | Root commit node rendered with square glyph in gutter; timeline displays single commit; metrics calculate 1 author, 1 commit. |
| 10 | **Large History (10k+ Commits)** | Large open-source repository (e.g. `facebook/react`, `microsoft/vscode`) | Virtualized lists (`@tanstack/react-virtual`) keep DOM node count constant (~30-50 nodes). Memory stays stable. |

---

## 3. Claim Check: Exhaustive Inventory of Numbers & Limits

In accordance with **P4 PRD Rule 7** (*"Honesty week: scan every claim — no 'first ever', no 'blazing', no unmeasured numbers"*), every user-visible sentence mentioning a number, limitation, heuristic, or metric assumption is cataloged below with its source file and line number:

| File Path & Line | On-Screen Text / Claim | Why It's Honest & How QA Verifies |
|---|---|---|
| `src/content/about.ts:45` | *"Turn repository history into a commit graph, a file life story, and a health dashboard in seconds — running entirely on your local machine, honest about every limitation."* | Verified: Local execution only. No unmeasured 50k claims; references actual measured execution. |
| `src/content/about.ts:63` | *"Git detects renames by comparing file contents rather than storing explicit move events. If a file undergoes heavy structural refactoring in the same commit where it is moved, similarity drops below Git’s detection threshold and the link is lost. Rather than fabricating unverified lineage, GitViz displays a visible history break."* | Verified: Explains Git's default 50% similarity threshold honestly; shows visible break rather than fake links. |
| `src/content/about.ts:70` | *"Linus Torvalds noted that git log --follow skips merge commits and can overcount historical edits across diverging branches. GitViz queries standard file history with rename detection, keeping merge commits and boundaries visible."* | Verified: Technical rationale for why GitViz avoids the `git log --follow` hack and provides a merge toggle. |
| `src/content/about.ts:77` | *"Bus factor here measures the concentration of commits among authors, not true code comprehension. A high commit percentage indicates who made historical edits, not who understands the architectural context."* | Verified: Prevents the common misconception that bus factor represents human knowledge. |
| `src/content/about.ts:84` | *"Code churn correlates with bug density in empirical software engineering research, but it does not predict defects. A high-churn file is labeled as a hotspot to guide review and refactoring attention, never as guaranteed to fail."* | Verified: Disclaims predictive defect claims; backed by empirical research (Nagappan & Ball). |
| `src/content/about.ts:91` | *"Whether merge commits count toward churn is determined by the metrics engine and explicitly labeled on every chart. Time-to-merge calculations evaluate only the first-parent branch lineage to prevent double-counting branch changes."* | Verified: Explicitly calls out the effect of merge commits on line counts. |
| `src/content/about.ts:98` | *"Generated files and dependency lockfiles (e.g., package-lock.json, pnpm-lock.yaml, dist/) frequently account for thousands of lines of churn. To keep hotspot rankings useful, these patterns are excluded by default via a configurable ignore list."* | Verified: Explains why churn numbers don't explode from lockfile noise. |
| `src/content/about.ts:105` | *"Performance claims are strictly bounded by what our test suites have measured. Browsers degrade when attempting to mount tens of thousands of DOM nodes simultaneously, which is why commit lists and file pickers use virtualized rendering from day one."* | Verified: Admits DOM limits and explains virtualized windowing. |
| `src/content/about.ts:112` | *"Assigning branches to parallel tracks without intersecting lines across arbitrary Git DAGs is NP-hard in general. Greedy heuristics minimize crossovers, but merge-dense or octopus histories may exhibit unavoidable track intersections."* | Verified: Admits graph layout NP-hardness and heuristic tradeoffs honestly. |
| `src/content/about.ts:121` | *"CodeScene provides similar behavioral code analysis as a commercial, closed-source SaaS product. GitViz is free, open source, and runs entirely on your own local machine. Our focus is combining interactive graph exploration, file evolution timelines, and health metrics in one unified local developer tool."* | Verified: Matches P4 prepared answer 1 verbatim. |
| `src/content/about.ts:127` | *"AI models answer 'What does this snippet do?' GitViz answers 'Across the complete repository history, which modules have concentrated author ownership, which files experience heavy churn, and how did this module evolve?' GitViz computes deterministic numbers from Git metadata rather than generating probabilistic text."* | Verified: Matches P4 prepared answer 2 verbatim. |
| `src/content/about.ts:133` | *"No claim of being 'first ever' is made. GitViz combines several established visualization views — commit DAGs, file diff timelines, and repository health metrics — into a single, cohesive, free local interface."* | Verified: Matches P4 prepared answer 3 verbatim. |
| `src/content/about.ts:139` | *"No predictive breakage claim is made. High churn highlights files that undergo frequent modification, which research shows is where bugs are most often introduced. Hotspot rankings simply guide where to focus code review and test coverage first."* | Verified: Matches P4 prepared answer 4 verbatim. |
| `src/components/home/Hero.tsx:22` | *"Free · Open source · Runs on your machine"* | Verified: Free license, 100% client/local execution. |
| `src/components/home/Hero.tsx:72` | *"Numbers computed from Git, not guessed"* | Verified: Values derive from deterministic Git log parsing. |
| `src/components/home/Features.tsx:36` | *"Rendering is virtualized, so only visible commits are drawn. Supported history size depends on measured results."* | Verified: No unverified 50k claims in feature card. |
| `src/components/home/Features.tsx:82` | *"If Git cannot detect a rename, the history shows a visible break instead of a guessed link."* | Verified: Refuses to guess unlinked file history. |
| `src/components/home/Features.tsx:143` | *"Bus factor is an estimate based on commit concentration. A hotspot means inspect this, not this will break."* | Verified: Consistent disclaimer in dashboard feature card. |
| `src/components/home/HowItWorks.tsx:29` | *"Reads the history in a single pass and shows progress while it imports."* | Verified: Single-pass parser architecture documented in P1 PRD. |
| `src/components/home/HowItWorks.tsx:160` | *"Ignored by default: lockfiles and build folders, editable by you"* | Verified: Confirms configurable ignore pattern behavior. |
| `src/components/graph/GraphToolbar.tsx:67` | *"All authors ({authors.length})"* | Verified: Exact count calculated from commit dataset. |
| `src/components/graph/GraphToolbar.tsx:87` | *"All branches ({branches.length})"* | Verified: Exact branch hint count calculated from commit dataset. |
| `src/components/graph/GraphToolbar.tsx:116` | *"{filteredCount} of {totalCount} commits"* | Verified: Dynamic ratio displayed and updated on every filter change. |
| `src/components/graph/GraphLegend.tsx:53` | *"Some overlap may occur on very merge-heavy histories."* | Verified: Honest admission in legend panel. |
| `src/components/graph/GraphLegend.tsx:92` | *"Lane colors identify branch lines only; they do not carry meaning between sessions."* | Verified: Clarifies that colors are temporary session IDs. |
| `src/views/FileEvolution.tsx:77` | *"Explore unified diffs, rename history, and chronological commits. Lineage breaks are surfaced honestly when Git's rename heuristics lose track."* | Verified: Prominently stated in page subtitle. |
| `src/components/files/FileTimeline.tsx:100` | *"Linus Torvalds noted git log --follow skips merge commits. GitViz includes them by default, with this toggle to inspect direct changes only."* | Verified: Explains merge toggle rationale via tooltip. |
| `src/components/files/FileTimeline.tsx:152` | *"History cutoff: Earlier history for this file was not linked due to a rename detection threshold or shallow repository depth."* | Verified: Displayed when `history_complete: false`. |
| `src/components/files/TimelineEntry.tsx:133` | *"History break: rename detection cutoff"* | Verified: Prominent warning banner between disconnected commits. |
| `src/views/Dashboard.tsx:85` | *"Sample data"* | Verified: Badge displayed when in mock mode (`USE_MOCK=true`). |
| `src/views/Dashboard.tsx:202` | Bus factor StatCard: `badge="estimate"` | Verified: Every score appearance is accompanied by the estimate pill. |
| `src/components/dashboard/TopChurnChart.tsx:103` | *"Top-10 Code Churn"* | Verified: Bounded to top 10 items. |
| `src/components/dashboard/TopChurnChart.tsx:105` | *"Merge commits are [NOT] counted toward churn. Churn correlates with bug density but does not predict bugs directly."* | Verified: Dynamic sentence reflecting API payload flag. |
| `src/components/dashboard/BusFactorPanel.tsx:30` | *"estimate"* | Verified: Warning badge on Bus Factor panel header. |
| `src/components/dashboard/BusFactorPanel.tsx:49` | *"Bus factor here measures how concentrated commits are among authors. It is not a measure of who actually knows the code."* | Verified: Persistent explanation below bus factor score. |
| `src/components/dashboard/BusFactorPanel.tsx:56` | *"Only one author found. Bus factor is 1 by definition."* | Verified: Avoids misleading alarm for single-author repos. |
| `src/components/dashboard/HonestyNotes.tsx:33` | *"Hotspots: Churn correlates with bugs but does not predict them. A hotspot means inspect this, never 'this will break'."* | Verified: Clear guidance in the dashboard footer card. |
| `src/components/dashboard/metricsUtils.ts:39` | `classifyBusFactor`: `score <= 1` (Concentrated), `score === 2` (Moderate), `score >= 3` (Spread) | Verified: Documented heuristic classification thresholds. |
| `src/components/load/WhatHappensCard.tsx:49` | *"Import time depends on repository size and the machine. GitViz does not promise a specific speed."* | Verified: Disclaims unmeasured speed/time promises; sets honest expectations. |
| `src/components/load/RepoPathForm.tsx:142` | *"This is the path on the machine where the GitViz backend runs. GitViz only reads the repository and never changes it."* | Verified: Explains path execution context and read-only guarantee. |
| `src/components/load/ImportProgress.tsx:180` | *"Your repository was not changed."* | Verified: Displayed on import failure to reassure user that repo integrity is intact. |
| `src/components/load/loadUtils.ts:18` | `MAX_RECENT_REPOS = 5` | Verified: Bounds recent repository list to 5 items to avoid storage bloat. |
| `src/components/load/loadUtils.ts:74` | Milestone steps: `0` (Queued), `> 0` (Reading history), `80` (Saving results), `100` (Done) | Verified: Strictly deterministic step mapping based on percentage ranges without timing claims. |
