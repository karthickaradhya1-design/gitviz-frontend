/**
 * GitViz Content Configuration: About, Limitations, FAQ, and Project Info
 *
 * Teammates can edit or expand these texts without modifying React components.
 * Keep descriptions neutral, factual, and backed by measurable realities.
 */

export type LimitationArea = 'history' | 'metrics' | 'performance' | 'scope';

export interface LimitationItem {
  id: string;
  title: string;
  description: string;
  area: LimitationArea;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface PrivacyPoint {
  title: string;
  description: string;
}

export interface TeamRole {
  role: string;
  area: string;
  description: string;
}

export interface ProjectInfo {
  name: string;
  tagline: string;
  description: string;
  stack: string[];
}

export const projectInfo: ProjectInfo = {
  name: 'GitViz',
  tagline: 'Local Git analytics and evolution visualizer',
  description:
    'Turn repository history into a commit graph, a file life story, and a health dashboard in seconds — running entirely on your local machine, honest about every limitation.',
  stack: [
    'React 18',
    'TypeScript',
    'Vite',
    'Recharts',
    'React Query',
    'TanStack Virtual',
    'Lucide Icons',
  ],
};

export const limitations: LimitationItem[] = [
  {
    id: 'renames-break-history',
    title: 'Renames can break file history',
    area: 'history',
    description:
      'Git detects renames by comparing file contents rather than storing explicit move events. If a file undergoes heavy structural refactoring in the same commit where it is moved, similarity drops below Git’s detection threshold and the link is lost. Rather than fabricating unverified lineage, GitViz displays a visible history break.',
  },
  {
    id: 'git-log-follow',
    title: 'git log --follow is not used',
    area: 'history',
    description:
      'Linus Torvalds noted that git log --follow skips merge commits and can overcount historical edits across diverging branches. GitViz queries standard file history with rename detection, keeping merge commits and boundaries visible.',
  },
  {
    id: 'bus-factor-estimate',
    title: 'Bus factor is an estimate',
    area: 'metrics',
    description:
      'Bus factor here measures the concentration of commits among authors, not true code comprehension. A high commit percentage indicates who made historical edits, not who understands the architectural context.',
  },
  {
    id: 'churn-not-bug-predictor',
    title: 'Churn is not a bug predictor',
    area: 'metrics',
    description:
      'Code churn correlates with bug density in empirical software engineering research, but it does not predict defects. A high-churn file is labeled as a hotspot to guide review and refactoring attention, never as guaranteed to fail.',
  },
  {
    id: 'merge-commits-affect-numbers',
    title: 'Merge commits affect metrics numbers',
    area: 'metrics',
    description:
      'Whether merge commits count toward churn is determined by the metrics engine and explicitly labeled on every chart. Time-to-merge calculations evaluate only the first-parent branch lineage to prevent double-counting branch changes.',
  },
  {
    id: 'lockfiles-ignored-by-default',
    title: 'Lockfiles and build folders are ignored by default',
    area: 'metrics',
    description:
      'Generated files and dependency lockfiles (e.g., package-lock.json, pnpm-lock.yaml, dist/) frequently account for thousands of lines of churn. To keep hotspot rankings useful, these patterns are excluded by default via a configurable ignore list.',
  },
  {
    id: 'large-history-limits',
    title: 'Very large histories are limited by measurement',
    area: 'performance',
    description:
      'Performance claims are strictly bounded by what our test suites have measured. Browsers degrade when attempting to mount tens of thousands of DOM nodes simultaneously, which is why commit lists and file pickers use virtualized rendering from day one.',
  },
  {
    id: 'graph-layout-overlap',
    title: 'Graph layout can overlap on merge-heavy histories',
    area: 'scope',
    description:
      'Assigning branches to parallel tracks without intersecting lines across arbitrary Git DAGs is NP-hard in general. Greedy heuristics minimize crossovers, but merge-dense or octopus histories may exhibit unavoidable track intersections.',
  },
];

export const faqList: FaqItem[] = [
  {
    id: 'codescene-comparison',
    question: "Doesn't CodeScene already do this?",
    answer:
      "CodeScene provides similar behavioral code analysis as a commercial, closed-source SaaS product. GitViz is free, open source, and runs entirely on your own local machine. Our focus is combining interactive graph exploration, file evolution timelines, and health metrics in one unified local developer tool.",
  },
  {
    id: 'ai-explanation-comparison',
    question: "Can't AI just explain a codebase?",
    answer:
      'AI models answer "What does this snippet do?" GitViz answers "Across the complete repository history, which modules have concentrated author ownership, which files experience heavy churn, and how did this module evolve?" GitViz computes deterministic numbers from Git metadata rather than generating probabilistic text.',
  },
  {
    id: 'first-tool-claim',
    question: 'Is GitViz the first tool like this?',
    answer:
      'No claim of being "first ever" is made. GitViz combines several established visualization views — commit DAGs, file diff timelines, and repository health metrics — into a single, cohesive, free local interface.',
  },
  {
    id: 'hotspot-breakage',
    question: 'Will the hotspot files break?',
    answer:
      'No predictive breakage claim is made. High churn highlights files that undergo frequent modification, which research shows is where bugs are most often introduced. Hotspot rankings simply guide where to focus code review and test coverage first.',
  },
];

export const privacyPoints: PrivacyPoint[] = [
  {
    title: 'Runs locally',
    description:
      'The entire ingestion and analysis runs on your machine. Your source code and commit history never leave your computer.',
  },
  {
    title: 'Read-only repository access',
    description:
      'GitViz strictly executes read-only Git commands. It never checks out branches, alters workspace files, or modifies your repository state.',
  },
  {
    title: 'Zero data egress',
    description:
      'No telemetry, code snippets, author emails, or analytics metrics are transmitted to any cloud service or third-party server.',
  },
];

// TODO: Replace role placeholders with actual teammate names when finalized
export const teamRoles: TeamRole[] = [
  {
    role: 'Backend Engineer',
    area: 'Git ingestion and REST API',
    description: 'Single-pass Git log parser and Express REST service architecture.',
  },
  {
    role: 'Data Engineer',
    area: 'Schema, metrics and export',
    description: 'PostgreSQL schema, metrics engine for churn and bus factor, and snapshot export.',
  },
  {
    role: 'Frontend Engineer',
    area: 'React UI',
    description: 'Virtualized commit DAG, file evolution timeline, and health dashboard.',
  },
  {
    role: 'Product & QA',
    area: 'Testing, demo and documentation',
    description: 'Quality checklist, weird-repo validation pass, demo script, and claim-checking.',
  },
];

export const lastReviewedDate = '2026-10-30';
