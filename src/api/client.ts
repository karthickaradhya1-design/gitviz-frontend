/**
 * GitViz API Client (Single Choke Point)
 *
 * The browser never touches Git or Postgres directly.
 * All data requests throughout the application must flow exclusively through this file.
 *
 * USE_MOCK flag:
 * - When `true`: Uses mock hand-written JSON files in `src/mock/`.
 * - When `false`: Calls the real GitViz REST backend endpoints (P1/P2 Express API).
 *
 * Testing States (in mock mode only):
 * Pass `?state=loading`, `?state=empty`, or `?state=error` in the browser URL
 * to verify loading, empty, and error fallback states.
 */

import {
  CommitDetail,
  CommitListResponse,
  GetCommitParams,
  GetCommitsParams,
  FileSummary,
  FileHistoryResponse,
  GetFilesParams,
  GetFileHistoryParams,
  ChurnResponse,
  BusFactorResponse,
  GetChurnParams,
  GetBusFactorParams,
  GetExportUrlParams,
  CreateRepoRequest,
  CreateRepoResponse,
  RepoStatus,
  GetRepoStatusParams,
} from './types';
import mockCommitsData from '../mock/commits.json';
import mockCommitDetailData from '../mock/commit-detail.json';
import mockFilesData from '../mock/files.json';
import mockFileHistoryData from '../mock/file-history.json';
import mockFileHistorySimpleData from '../mock/file-history-simple.json';
import mockMetricsChurnData from '../mock/metrics-churn.json';
import mockMetricsBusFactorData from '../mock/metrics-bus-factor.json';

export const USE_MOCK: boolean = import.meta.env.VITE_USE_MOCK !== 'false';
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/** Helper to simulate network latency in mock mode */
const simulateDelay = (ms: number = 400): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Inspect URL query param `state` for testing loading/empty/error states */
function getDevSimulatedState(): 'loading' | 'empty' | 'error' | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const state = params.get('state');
  if (state === 'loading' || state === 'empty' || state === 'error') {
    return state;
  }
  return null;
}

/**
 * Fetch commits list with cursor-based pagination
 * GET /api/v1/repos/:id/commits?cursor=&limit=
 */
export async function getCommits({
  repoId = 'default',
  cursor = null,
  limit = 50,
}: GetCommitsParams = {}): Promise<CommitListResponse> {
  if (USE_MOCK) {
    const devState = getDevSimulatedState();

    if (devState === 'loading') {
      // Delay indefinitely to test loading skeleton
      await simulateDelay(60000);
    }

    if (devState === 'error') {
      await simulateDelay(300);
      throw new Error(
        'Simulated API error: failed to fetch repository commits (test state)'
      );
    }

    if (devState === 'empty') {
      await simulateDelay(200);
      return { commits: [], next_cursor: null };
    }

    await simulateDelay(400);

    const commits = mockCommitsData.commits;
    return {
      commits: commits.slice(0, limit),
      next_cursor: mockCommitsData.next_cursor,
    };
  }

  // Real backend API endpoint
  const query = new URLSearchParams();
  if (cursor) query.set('cursor', cursor);
  if (limit) query.set('limit', String(limit));

  const url = `${API_BASE_URL}/repos/${encodeURIComponent(repoId)}/commits?${query.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch commits: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch commit detail with changed files
 * GET /api/v1/repos/:id/commits/:sha
 */
export async function getCommit({
  repoId = 'default',
  sha,
}: GetCommitParams): Promise<CommitDetail> {
  if (USE_MOCK) {
    const devState = getDevSimulatedState();
    if (devState === 'loading') {
      await simulateDelay(60000);
    }
    if (devState === 'error') {
      await simulateDelay(300);
      throw new Error(
        `Simulated API error: commit ${sha} could not be retrieved`
      );
    }

    await simulateDelay(350);

    // If matches the detailed mock commit, return it
    if (
      sha === mockCommitDetailData.sha ||
      sha === mockCommitDetailData.short_sha
    ) {
      return mockCommitDetailData as CommitDetail;
    }

    // Otherwise find the commit in the commits list and generate realistic files
    const found = mockCommitsData.commits.find(
      (c) => c.sha === sha || c.short_sha === sha
    );

    if (found) {
      return {
        ...found,
        files: [
          {
            path: 'src/components/graph/CommitList.tsx',
            old_path: null,
            additions: Math.max(1, Math.round(found.additions * 0.6)),
            deletions: Math.max(0, Math.round(found.deletions * 0.5)),
            is_binary: false,
          },
          {
            path: 'src/api/client.ts',
            old_path: null,
            additions: Math.max(1, Math.round(found.additions * 0.4)),
            deletions: Math.max(0, Math.round(found.deletions * 0.5)),
            is_binary: false,
          },
        ],
      };
    }

    // Fallback to mock detail
    return mockCommitDetailData as CommitDetail;
  }

  // Real backend API endpoint
  const url = `${API_BASE_URL}/repos/${encodeURIComponent(repoId)}/commits/${encodeURIComponent(sha)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch commit ${sha}: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch list of tracked files with commit counts and last touch dates
 * GET /api/v1/repos/:id/files
 */
export async function getFiles({
  repoId = 'default',
}: GetFilesParams = {}): Promise<FileSummary[]> {
  if (USE_MOCK) {
    const devState = getDevSimulatedState();
    if (devState === 'loading') {
      await simulateDelay(60000);
    }
    if (devState === 'error') {
      await simulateDelay(300);
      throw new Error('Simulated API error: failed to fetch repository files list');
    }
    if (devState === 'empty') {
      await simulateDelay(200);
      return [];
    }

    await simulateDelay(300);
    return mockFilesData as FileSummary[];
  }

  const url = `${API_BASE_URL}/repos/${encodeURIComponent(repoId)}/files`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch files: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch complete commit history and diffs for a specific file
 * GET /api/v1/repos/:id/files/:path/history
 */
export async function getFileHistory({
  repoId = 'default',
  path,
}: GetFileHistoryParams): Promise<FileHistoryResponse> {
  if (USE_MOCK) {
    const devState = getDevSimulatedState();
    if (devState === 'loading') {
      await simulateDelay(60000);
    }
    if (devState === 'error') {
      await simulateDelay(300);
      throw new Error(`Simulated API error: failed to fetch history for ${path}`);
    }
    if (devState === 'empty') {
      await simulateDelay(200);
      return { path, history_complete: true, entries: [] };
    }

    await simulateDelay(350);

    // If requesting package.json, return the clean simple history
    if (path === 'package.json') {
      return mockFileHistorySimpleData as FileHistoryResponse;
    }

    // If requesting router.ts or src/core/router.ts, return the rich mock with rename & break
    if (path === 'src/core/router.ts' || path === 'src/router.ts') {
      return mockFileHistoryData as FileHistoryResponse;
    }

    // For any other file from files.json, adapt mock entries to provide realistic interactive history
    const matchedFile = (mockFilesData as FileSummary[]).find((f) => f.path === path);
    const count = matchedFile ? Math.min(matchedFile.commit_count, mockFileHistoryData.entries.length) : 6;

    return {
      path,
      history_complete: true,
      entries: mockFileHistoryData.entries.slice(0, count).map((entry, idx) => ({
        ...entry,
        old_path: null,
        break_after: null,
        message: idx === 0 ? `refactor: update implementation of ${path.split('/').pop()}` : entry.message,
      })),
    };
  }

  const url = `${API_BASE_URL}/repos/${encodeURIComponent(repoId)}/files/${encodeURIComponent(path)}/history`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch history for file ${path}: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch code churn metrics (top files, authors, time series)
 * GET /api/v1/repos/:id/metrics/churn
 */
export async function getChurn({
  repoId = 'default',
}: GetChurnParams = {}): Promise<ChurnResponse> {
  if (USE_MOCK) {
    const devState = getDevSimulatedState();
    if (devState === 'loading') {
      await simulateDelay(60000);
    }
    if (devState === 'error') {
      await simulateDelay(300);
      throw new Error('Simulated API error: failed to fetch repository churn metrics');
    }
    if (devState === 'empty') {
      await simulateDelay(200);
      return {
        repo: {
          name: 'empty-repo',
          commit_count: 0,
          author_count: 0,
          first_commit_at: '',
          last_commit_at: '',
        },
        merge_commits_counted: false,
        ignored_patterns: [],
        top_files: [],
        commits_per_author: [],
        churn_over_time: [],
      };
    }

    await simulateDelay(400);
    return mockMetricsChurnData as ChurnResponse;
  }

  const url = `${API_BASE_URL}/repos/${encodeURIComponent(repoId)}/metrics/churn`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch churn metrics: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch bus factor score and module breakdowns
 * GET /api/v1/repos/:id/metrics/bus-factor
 */
export async function getBusFactor({
  repoId = 'default',
}: GetBusFactorParams = {}): Promise<BusFactorResponse> {
  if (USE_MOCK) {
    const devState = getDevSimulatedState();
    if (devState === 'loading') {
      await simulateDelay(60000);
    }
    if (devState === 'error') {
      await simulateDelay(300);
      throw new Error('Simulated API error: failed to fetch repository bus factor metrics');
    }
    if (devState === 'empty') {
      await simulateDelay(200);
      return {
        score: 0,
        label: 'estimate (concentration of commits)',
        top_contributor_share: 0,
        modules: [],
      };
    }

    await simulateDelay(400);
    return mockMetricsBusFactorData as BusFactorResponse;
  }

  const url = `${API_BASE_URL}/repos/${encodeURIComponent(repoId)}/metrics/bus-factor`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch bus factor: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get export URL for downloading repository snapshot
 * GET /api/v1/repos/:id/export?format=json|csv
 */
export function getExportUrl({
  repoId = 'default',
  format = 'json',
}: GetExportUrlParams): string {
  return `${API_BASE_URL}/repos/${encodeURIComponent(repoId)}/export?format=${encodeURIComponent(format)}`;
}

/**
 * Download metrics snapshot in JSON or CSV format.
 * In mock mode: generates and downloads in-browser via Blob.
 * In live mode: triggers download from the backend export URL.
 */
export function downloadExport({
  repoId = 'default',
  format = 'json',
  churnData,
  busFactorData,
}: {
  repoId?: string;
  format: 'json' | 'csv';
  churnData?: ChurnResponse;
  busFactorData?: BusFactorResponse;
}): void {
  if (!USE_MOCK) {
    const exportUrl = getExportUrl({ repoId, format });
    window.open(exportUrl, '_blank');
    return;
  }

  // Client-side mock export generator
  const activeChurn = churnData || (mockMetricsChurnData as ChurnResponse);
  const activeBus = busFactorData || (mockMetricsBusFactorData as BusFactorResponse);

  let blob: Blob;
  let filename: string;

  if (format === 'json') {
    const exportPayload = {
      repository: repoId,
      exported_at: new Date().toISOString(),
      note: 'GitViz health metrics snapshot (honest estimate)',
      churn: activeChurn,
      bus_factor: activeBus,
    };
    blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    filename = `gitviz-metrics-${repoId}.json`;
  } else {
    // Generate CSV from top_files
    const headers = ['path', 'churn_commits', 'churn_lines', 'last_touch_at'];
    const rows = (activeChurn.top_files || []).map((f) => {
      // Escape paths containing quotes or commas
      const escapedPath = `"${f.path.replace(/"/g, '""')}"`;
      return [escapedPath, f.churn_commits, f.churn_lines, `"${f.last_touch_at}"`].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    filename = `gitviz-top-churn-${repoId}.csv`;
  }

  // Trigger browser download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * In-memory state for mock repository import simulation
 */
interface MockImportState {
  pct: number;
  commit_count: number;
  status: 'ingesting' | 'done' | 'error';
  error?: string;
  callCount: number;
}

const mockImports = new Map<string, MockImportState>();

/**
 * Reset mock import simulation state (useful for tests and retry flows)
 */
export function resetMockImportState(repoId: string = 'sample-repo'): void {
  mockImports.delete(repoId);
}

/**
 * Create a new repository ingestion job
 * POST /api/v1/repos
 */
export async function createRepo({
  path,
}: CreateRepoRequest): Promise<CreateRepoResponse> {
  if (USE_MOCK) {
    const params =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();
    const devState = params.get('state');

    if (devState === 'error') {
      await simulateDelay(300);
      throw new Error('Simulated API error: failed to initialize repository ingestion (test state)');
    }

    if (path.trim() === '/does/not/exist') {
      await simulateDelay(300);
      throw new Error('Path not found or not a Git repository');
    }

    await simulateDelay(400);

    // Initialize fresh simulation state for sample-repo
    mockImports.set('sample-repo', {
      pct: 0,
      commit_count: 0,
      status: 'ingesting',
      callCount: 0,
    });

    return {
      repo_id: 'sample-repo',
      status: 'ingesting',
    };
  }

  // Real backend API endpoint
  const response = await fetch(`${API_BASE_URL}/repos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path }),
  });

  if (!response.ok) {
    let errorMessage = `Failed to create repository (${response.status} ${response.statusText})`;
    try {
      const errorJson = await response.json();
      if (errorJson.message) {
        errorMessage = errorJson.message;
      }
    } catch {
      // Ignore JSON parse failure and use status text
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Get progress status of repository ingestion job
 * GET /api/v1/repos/:id/status
 */
export async function getRepoStatus({
  repoId,
}: GetRepoStatusParams): Promise<RepoStatus> {
  if (USE_MOCK) {
    const params =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();
    const devState = params.get('state');

    await simulateDelay(150);

    const totalCommits = mockMetricsChurnData.repo.commit_count || 1248;
    let current = mockImports.get(repoId);

    if (!current) {
      current = {
        pct: 0,
        commit_count: 0,
        status: 'ingesting',
        callCount: 0,
      };
      mockImports.set(repoId, current);
    }

    // If already terminal (done or error), return existing state
    if (current.status === 'done' || current.status === 'error') {
      return {
        pct: current.pct,
        commit_count: current.commit_count,
        status: current.status,
        error: current.error,
      };
    }

    current.callCount += 1;

    // Check query string simulation switches
    if (devState === 'import-error') {
      // Advance to about 60% then fail
      const nextPct = Math.min(60, current.pct + 25);
      current.pct = nextPct;
      current.commit_count = Math.round((nextPct / 100) * totalCommits);

      if (current.pct >= 60) {
        current.status = 'error';
        current.error = 'Corrupted object or repository read error during git log ingestion';
      } else {
        current.status = 'ingesting';
      }
    } else if (devState === 'slow') {
      // Slower incremental progress (+10% per call)
      const nextPct = Math.min(100, current.pct + 10);
      current.pct = nextPct;
      current.commit_count = Math.round((nextPct / 100) * totalCommits);
      current.status = current.pct >= 100 ? 'done' : 'ingesting';
    } else {
      // Normal mock progression (+25% per poll: 25% -> 50% -> 75% -> 100%)
      const nextPct = Math.min(100, current.pct + 25);
      current.pct = nextPct;
      current.commit_count = Math.round((nextPct / 100) * totalCommits);
      current.status = current.pct >= 100 ? 'done' : 'ingesting';
    }

    return {
      pct: current.pct,
      commit_count: current.commit_count,
      status: current.status,
      error: current.error,
    };
  }

  // Real backend API endpoint
  const response = await fetch(`${API_BASE_URL}/repos/${encodeURIComponent(repoId)}/status`);

  if (!response.ok) {
    let errorMessage = `Failed to get repository status (${response.status} ${response.statusText})`;
    try {
      const errorJson = await response.json();
      if (errorJson.message) {
        errorMessage = errorJson.message;
      }
    } catch {
      // Ignore JSON parse failure
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

