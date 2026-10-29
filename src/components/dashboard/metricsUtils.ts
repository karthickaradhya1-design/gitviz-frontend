import { TopFile } from '../../api/types';

export interface BusFactorClassification {
  level: 'danger' | 'warning' | 'success';
  label: 'Concentrated' | 'Moderate' | 'Spread';
  description: string;
}

/**
 * Truncate a path in the middle with an ellipsis (...) if it exceeds maxLength.
 */
export function truncateMiddle(path: string, maxLength: number = 32): string {
  if (!path) return '';
  if (path.length <= maxLength) return path;
  if (maxLength <= 5) return path.slice(0, maxLength);

  const available = maxLength - 3; // space for '...'
  const headLength = Math.ceil(available / 2);
  const tailLength = Math.floor(available / 2);

  return `${path.slice(0, headLength)}...${path.slice(path.length - tailLength)}`;
}

/**
 * Identify top hotspot files by commit churn count (default top 3).
 */
export function getTopHotspotPaths(files: TopFile[], count: number = 3): Set<string> {
  if (!files || files.length === 0) return new Set();
  const sorted = [...files].sort((a, b) => b.churn_commits - a.churn_commits);
  return new Set(sorted.slice(0, count).map((f) => f.path));
}

/**
 * Classify a bus factor score into risk category.
 * 1 = Concentrated (danger)
 * 2 = Moderate (warning)
 * 3+ = Spread (success)
 */
export function classifyBusFactor(score: number): BusFactorClassification {
  if (score <= 1) {
    return {
      level: 'danger',
      label: 'Concentrated',
      description: 'Critical dependency on one contributor',
    };
  }
  if (score === 2) {
    return {
      level: 'warning',
      label: 'Moderate',
      description: 'Shared among a few contributors',
    };
  }
  return {
    level: 'success',
    label: 'Spread',
    description: 'Broadly distributed contributions',
  };
}

/**
 * Escape a string value for safe CSV export (RFC 4180).
 */
export function escapeCsvField(value: string | number): string {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generate standard CSV string from top_files array.
 */
export function generateTopFilesCsv(files: TopFile[]): string {
  const headers = ['path', 'churn_commits', 'churn_lines', 'last_touch_at'];
  if (!files || files.length === 0) {
    return headers.join(',');
  }

  const rows = files.map((file) => [
    escapeCsvField(file.path),
    file.churn_commits,
    file.churn_lines,
    escapeCsvField(file.last_touch_at),
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Format active date range (first commit to last commit).
 */
export function formatActivePeriod(
  firstDate?: string | null,
  lastDate?: string | null
): string {
  if (!firstDate || !lastDate) return '—';

  try {
    const d1 = new Date(firstDate);
    const d2 = new Date(lastDate);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return '—';
    }

    const formatOpt: Intl.DateTimeFormatOptions = {
      month: 'short',
      year: 'numeric',
    };

    const s1 = d1.toLocaleDateString('en-US', formatOpt);
    const s2 = d2.toLocaleDateString('en-US', formatOpt);

    return `${s1} – ${s2}`;
  } catch {
    return '—';
  }
}

/**
 * Format ISO timestamp into clean readable date string (e.g. "Oct 24, 2026")
 */
export function formatDate(isoString?: string | null): string {
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

/**
 * Format decimal fraction into clean percentage (e.g. 0.58 -> "58%")
 */
export function formatPercent(fraction: number): string {
  if (isNaN(fraction)) return '0%';
  return `${Math.round(fraction * 100)}%`;
}
