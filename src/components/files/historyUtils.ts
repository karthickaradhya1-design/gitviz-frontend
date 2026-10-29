import { FileHistoryEntry } from '../../api/types';

export interface FileHistorySummary {
  totalCommits: number;
  uniqueAuthorsCount: number;
  firstCommittedAt: string | null;
  lastCommittedAt: string | null;
  totalAdditions: number;
  totalDeletions: number;
  hasHistoryBreak: boolean;
  hasRename: boolean;
}

export type DiffLineType = 'added' | 'removed' | 'hunk' | 'context';

export interface ParsedDiffLine {
  type: DiffLineType;
  content: string;
}

/**
 * Computes aggregated statistics for a file's history entries
 */
export function computeFileSummary(entries: FileHistoryEntry[]): FileHistorySummary {
  if (!entries || entries.length === 0) {
    return {
      totalCommits: 0,
      uniqueAuthorsCount: 0,
      firstCommittedAt: null,
      lastCommittedAt: null,
      totalAdditions: 0,
      totalDeletions: 0,
      hasHistoryBreak: false,
      hasRename: false,
    };
  }

  const authorsSet = new Set<string>();
  let totalAdditions = 0;
  let totalDeletions = 0;
  let hasHistoryBreak = false;
  let hasRename = false;

  let minTimestamp = Infinity;
  let maxTimestamp = -Infinity;
  let firstCommittedAt: string | null = null;
  let lastCommittedAt: string | null = null;

  for (const entry of entries) {
    if (entry.author) {
      const id = entry.author.email || entry.author.name;
      if (id) authorsSet.add(id);
    }

    totalAdditions += entry.additions || 0;
    totalDeletions += entry.deletions || 0;

    if (entry.break_after) {
      hasHistoryBreak = true;
    }
    if (entry.old_path) {
      hasRename = true;
    }

    if (entry.committed_at) {
      const time = new Date(entry.committed_at).getTime();
      if (!isNaN(time)) {
        if (time < minTimestamp) {
          minTimestamp = time;
          firstCommittedAt = entry.committed_at;
        }
        if (time > maxTimestamp) {
          maxTimestamp = time;
          lastCommittedAt = entry.committed_at;
        }
      }
    }
  }

  return {
    totalCommits: entries.length,
    uniqueAuthorsCount: authorsSet.size,
    firstCommittedAt,
    lastCommittedAt,
    totalAdditions,
    totalDeletions,
    hasHistoryBreak,
    hasRename,
  };
}

/**
 * Classifies a line of unified diff output
 */
export function classifyDiffLine(line: string): DiffLineType {
  if (line.startsWith('@@')) {
    return 'hunk';
  }
  // File headers like '+++ b/path' or '--- a/path' are context/metadata
  if (line.startsWith('+++') || line.startsWith('---')) {
    return 'context';
  }
  if (line.startsWith('+')) {
    return 'added';
  }
  if (line.startsWith('-')) {
    return 'removed';
  }
  return 'context';
}

/**
 * Splits raw unified diff string into classified lines
 */
export function parseDiff(rawDiff?: string): ParsedDiffLine[] {
  if (!rawDiff) return [];
  const lines = rawDiff.split('\n');
  return lines.map((line) => ({
    type: classifyDiffLine(line),
    content: line,
  }));
}

/**
 * Filters file history entries based on merge inclusion
 */
export function filterHistoryEntries(
  entries: FileHistoryEntry[],
  showMerges: boolean
): FileHistoryEntry[] {
  if (!entries) return [];
  if (showMerges) {
    return entries;
  }
  return entries.filter((entry) => !entry.is_merge);
}

/**
 * Formats ISO timestamp to human readable date string
 */
export function formatDate(isoString: string | null): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}
