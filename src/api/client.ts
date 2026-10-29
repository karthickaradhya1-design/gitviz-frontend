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
} from './types';
import mockCommitsData from '../mock/commits.json';
import mockCommitDetailData from '../mock/commit-detail.json';

export const USE_MOCK: boolean = true;
export const API_BASE_URL: string = '/api/v1';

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
