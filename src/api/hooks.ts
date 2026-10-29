/**
 * React Query hooks for GitViz API
 * Encapsulates caching, background fetching, and loading/error states.
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getCommit,
  getCommits,
  getFileHistory,
  getFiles,
  getChurn,
  getBusFactor,
  createRepo,
  getRepoStatus,
} from './client';
import {
  CommitDetail,
  CommitListResponse,
  GetCommitsParams,
  FileSummary,
  FileHistoryResponse,
  ChurnResponse,
  BusFactorResponse,
  CreateRepoRequest,
  CreateRepoResponse,
  RepoStatus,
} from './types';

export const COMMITS_QUERY_KEY = 'commits';
export const COMMIT_DETAIL_QUERY_KEY = 'commit-detail';
export const FILES_QUERY_KEY = 'files';
export const FILE_HISTORY_QUERY_KEY = 'file-history';
export const CHURN_QUERY_KEY = 'metrics-churn';
export const BUS_FACTOR_QUERY_KEY = 'metrics-bus-factor';
export const REPO_STATUS_QUERY_KEY = 'repo-status';

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

/**
 * Fetch list of all tracked repository files
 */
export function useFiles(repoId: string = 'default') {
  return useQuery<FileSummary[], Error>({
    queryKey: [FILES_QUERY_KEY, repoId],
    queryFn: () => getFiles({ repoId }),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch history and diff timeline for a single file
 */
export function useFileHistory(
  repoId: string = 'default',
  path: string | null | undefined
) {
  return useQuery<FileHistoryResponse, Error>({
    queryKey: [FILE_HISTORY_QUERY_KEY, repoId, path],
    queryFn: () => {
      if (!path) {
        throw new Error('File path is required');
      }
      return getFileHistory({ repoId, path });
    },
    enabled: Boolean(path),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch code churn metrics (top files, authors, time series)
 */
export function useChurn(repoId: string = 'default') {
  return useQuery<ChurnResponse, Error>({
    queryKey: [CHURN_QUERY_KEY, repoId],
    queryFn: () => getChurn({ repoId }),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch bus factor estimate metrics and module breakdowns
 */
export function useBusFactor(repoId: string = 'default') {
  return useQuery<BusFactorResponse, Error>({
    queryKey: [BUS_FACTOR_QUERY_KEY, repoId],
    queryFn: () => getBusFactor({ repoId }),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Mutation hook to start a repository ingestion job
 * POST /api/v1/repos
 */
export function useCreateRepo() {
  return useMutation<CreateRepoResponse, Error, CreateRepoRequest>({
    mutationFn: (variables: CreateRepoRequest) => createRepo(variables),
  });
}

/**
 * Hook to poll repository ingestion status until completion or error
 * GET /api/v1/repos/:id/status
 * Polls every ~1000ms, stops on done/error, and stops on unmount.
 */
export function useRepoStatus(
  repoId: string | null | undefined,
  enabled: boolean = true
) {
  return useQuery<RepoStatus, Error>({
    queryKey: [REPO_STATUS_QUERY_KEY, repoId],
    queryFn: () => {
      if (!repoId) {
        throw new Error('Repository ID is required to fetch status');
      }
      return getRepoStatus({ repoId });
    },
    enabled: Boolean(repoId) && enabled,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 1000;
      if (data.status === 'done' || data.status === 'error') {
        return false;
      }
      return 1000;
    },
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });
}

