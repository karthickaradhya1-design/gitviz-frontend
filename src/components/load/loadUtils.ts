/**
 * Pure helper utilities for repository loading, path validation, step mapping,
 * and recent repository storage.
 */

export interface RecentRepo {
  path: string;
  name: string;
  lastLoadedAt: string;
}

export type StepState = 'completed' | 'active' | 'pending';

export interface ImportStepItem {
  id: 'queued' | 'reading' | 'saving' | 'done';
  label: string;
  status: StepState;
}

export const STORAGE_KEY_CURRENT_REPO = 'gitviz_current_repo';
export const STORAGE_KEY_RECENT_REPOS = 'gitviz_recent_repos';
export const MAX_RECENT_REPOS = 5;

/**
 * Validate repository path on client side.
 * Checks for empty input, whitespace, and control/newline characters.
 * Does NOT check filesystem existence; backend handles that.
 */
export function validateRepoPath(path: string): string | null {
  if (!path || typeof path !== 'string' || path.trim().length === 0) {
    return 'Repository path is required.';
  }

  // Check for ASCII control characters (0-31) and DEL (127), including newlines and tabs
  // eslint-disable-next-line no-control-regex
  const controlCharRegex = /[\x00-\x1F\x7F]/;
  if (controlCharRegex.test(path)) {
    return 'Path contains invalid control characters or line breaks.';
  }

  return null;
}

/**
 * Extract repository name from path string.
 * Handles Windows backslashes, Unix forward slashes, spaces, and trailing slashes.
 */
export function getRepoNameFromPath(path: string): string {
  if (!path || typeof path !== 'string') {
    return 'repository';
  }

  // Strip trailing slashes and backslashes
  const trimmed = path.trim().replace(/[/\\]+$/, '');
  if (!trimmed) {
    return 'repository';
  }

  // Split on slashes/backslashes
  const segments = trimmed.split(/[/\\]+/).filter(Boolean);
  if (segments.length === 0) {
    return 'repository';
  }

  const lastSegment = segments[segments.length - 1];

  // If last segment is a Windows drive like "C:", fallback to drive name or repository
  if (/^[a-zA-Z]:$/.test(lastSegment)) {
    return `drive-${lastSegment.charAt(0).toLowerCase()}`;
  }

  return lastSegment;
}

/**
 * Map completion percentage (0 - 100) to current milestone step ID
 */
export function getStepFromPct(
  pct: number
): 'queued' | 'reading' | 'saving' | 'done' {
  if (pct >= 100) return 'done';
  if (pct >= 80) return 'saving';
  if (pct > 0) return 'reading';
  return 'queued';
}

/**
 * Derive full 4-step progress list from completion percentage
 */
export function getStepItems(pct: number): ImportStepItem[] {
  const clamped = Math.max(0, Math.min(100, pct));

  if (clamped >= 100) {
    return [
      { id: 'queued', label: 'Queued', status: 'completed' },
      { id: 'reading', label: 'Reading history', status: 'completed' },
      { id: 'saving', label: 'Saving results', status: 'completed' },
      { id: 'done', label: 'Done', status: 'completed' },
    ];
  }

  if (clamped >= 80) {
    return [
      { id: 'queued', label: 'Queued', status: 'completed' },
      { id: 'reading', label: 'Reading history', status: 'completed' },
      { id: 'saving', label: 'Saving results', status: 'active' },
      { id: 'done', label: 'Done', status: 'pending' },
    ];
  }

  if (clamped > 0) {
    return [
      { id: 'queued', label: 'Queued', status: 'completed' },
      { id: 'reading', label: 'Reading history', status: 'active' },
      { id: 'saving', label: 'Saving results', status: 'pending' },
      { id: 'done', label: 'Done', status: 'pending' },
    ];
  }

  return [
    { id: 'queued', label: 'Queued', status: 'active' },
    { id: 'reading', label: 'Reading history', status: 'pending' },
    { id: 'saving', label: 'Saving results', status: 'pending' },
    { id: 'done', label: 'Done', status: 'pending' },
  ];
}

/**
 * Normalize path for deduplication comparisons (trims whitespace and removes trailing slashes)
 */
function normalizePathForComparison(path: string): string {
  return path.trim().replace(/[/\\]+$/, '').toLowerCase();
}

/**
 * Add or update an entry in recent repositories list.
 * Deduplicates by path, places newest at index 0, and limits list to MAX_RECENT_REPOS (5).
 */
export function addRecentRepo(
  currentList: RecentRepo[],
  newEntry: { path: string; name?: string }
): RecentRepo[] {
  const trimmedPath = newEntry.path.trim();
  if (!trimmedPath) return currentList;

  const repoName = newEntry.name || getRepoNameFromPath(trimmedPath);
  const normalizedNew = normalizePathForComparison(trimmedPath);

  // Filter out any existing item with identical path
  const remaining = currentList.filter(
    (item) => normalizePathForComparison(item.path) !== normalizedNew
  );

  const updatedEntry: RecentRepo = {
    path: trimmedPath,
    name: repoName,
    lastLoadedAt: new Date().toISOString(),
  };

  return [updatedEntry, ...remaining].slice(0, MAX_RECENT_REPOS);
}

/**
 * Load recent repositories from localStorage safely
 */
export function loadRecentRepos(): RecentRepo[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_RECENT_REPOS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, MAX_RECENT_REPOS);
  } catch {
    return [];
  }
}

/**
 * Save recent repositories to localStorage safely
 */
export function saveRecentRepos(repos: RecentRepo[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY_RECENT_REPOS,
      JSON.stringify(repos.slice(0, MAX_RECENT_REPOS))
    );
  } catch {
    // Ignore storage quota or security errors
  }
}

/**
 * Clear recent repositories list from localStorage safely
 */
export function clearRecentRepos(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY_RECENT_REPOS);
  } catch {
    // Ignore storage errors
  }
}
