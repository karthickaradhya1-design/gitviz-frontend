/**
 * TypeScript API definitions for GitViz
 * Frozen schema matching REST contract from docs/GitViz - PRD - P1 Backend.md
 */

export interface Author {
  name: string;
  email: string;
}

export interface Commit {
  sha: string;
  short_sha: string;
  parents: string[];
  author: Author;
  committed_at: string; // ISO date
  message: string;
  is_merge: boolean;
  files_changed: number;
  additions: number;
  deletions: number;
  branch_hint?: string;
}

export interface CommitListResponse {
  commits: Commit[];
  next_cursor: string | null;
}

export interface FileChange {
  path: string;
  old_path: string | null; // Indicates rename when non-null
  additions: number;
  deletions: number;
  is_binary: boolean;
}

export interface CommitDetail extends Commit {
  files: FileChange[];
}

export interface GetCommitsParams {
  repoId?: string;
  cursor?: string | null;
  limit?: number;
}

export interface GetCommitParams {
  repoId?: string;
  sha: string;
}

export interface FileSummary {
  path: string;
  commit_count: number;
  last_touch_at: string;
}

export interface FileHistoryEntry {
  sha: string;
  short_sha: string;
  parents: string[];
  author: Author;
  committed_at: string;
  message: string;
  is_merge: boolean;
  additions: number;
  deletions: number;
  old_path?: string | null;
  break_after?: string | null;
  diff?: string;
}

export interface FileHistoryResponse {
  path: string;
  history_complete: boolean;
  entries: FileHistoryEntry[];
}

export interface GetFilesParams {
  repoId?: string;
}

export interface GetFileHistoryParams {
  repoId?: string;
  path: string;
}

export interface RepoSummary {
  name: string;
  commit_count: number;
  author_count: number;
  first_commit_at: string;
  last_commit_at: string;
}

export interface TopFile {
  path: string;
  churn_commits: number;
  churn_lines: number;
  last_touch_at: string;
}

export interface AuthorStat {
  name: string;
  commits: number;
  lines_added: number;
}

export interface ChurnPoint {
  period: string; // e.g. "2026-01"
  commits: number;
  lines_changed: number;
}

export interface ChurnResponse {
  repo: RepoSummary;
  merge_commits_counted: boolean;
  ignored_patterns: string[];
  top_files: TopFile[];
  commits_per_author: AuthorStat[];
  churn_over_time: ChurnPoint[];
}

export interface ModuleBusFactor {
  path: string;
  bus_factor: number;
  top_author: string;
  top_author_share: number;
}

export interface BusFactorResponse {
  score: number;
  label: string;
  top_contributor_share: number;
  modules: ModuleBusFactor[];
}

export interface GetChurnParams {
  repoId?: string;
}

export interface GetBusFactorParams {
  repoId?: string;
}

export interface GetExportUrlParams {
  repoId?: string;
  format: 'json' | 'csv';
}
