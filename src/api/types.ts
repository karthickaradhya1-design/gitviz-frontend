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
