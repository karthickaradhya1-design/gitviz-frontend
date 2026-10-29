/**
 * React Query hooks for GitViz API
 * Encapsulates caching, background fetching, and loading/error states.
 */

import { useQuery } from '@tanstack/react-query';
import { getCommit, getCommits } from './client';
import { CommitDetail, CommitListResponse, GetCommitsParams } from './types';

export const COMMITS_QUERY_KEY = 'commits';
export const COMMIT_DETAIL_QUERY_KEY = 'commit-detail';

/**
 * Fetch list of commits for a repository
 */
export function useCommits(
  repoId: string = 'default',
  params?: Omit<GetCommitsParams, 'repoId'>
) {
  return useQuery<CommitListResponse, Error>({
    queryKey: [COMMITS_QUERY_KEY, repoId, params?.cursor, params?.limit],
    queryFn: () => getCommits({ repoId, ...params }),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch detailed info for a single commit
 */
export function useCommit(
  repoId: string = 'default',
  sha: string | null | undefined
) {
  return useQuery<CommitDetail, Error>({
    queryKey: [COMMIT_DETAIL_QUERY_KEY, repoId, sha],
    queryFn: () => {
      if (!sha) {
        throw new Error('Commit SHA is required');
      }
      return getCommit({ repoId, sha });
    },
    enabled: Boolean(sha),
    staleTime: 5 * 60 * 1000,
  });
}
