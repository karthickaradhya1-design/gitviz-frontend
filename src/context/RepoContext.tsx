import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getRepoStatus, USE_MOCK } from '../api/client';
import { STORAGE_KEY_CURRENT_REPO } from '../components/load/loadUtils';

export interface RepoInfo {
  repoId: string;
  name: string;
  path: string;
  status: 'ingesting' | 'done' | 'error';
  commitCount?: number;
}

export interface RepoContextValue {
  repo: RepoInfo | null;
  activeRepoId: string | null;
  setRepo: (repo: RepoInfo | null) => void;
  clearRepo: () => void;
  updateRepoStatus: (status: 'ingesting' | 'done' | 'error', commitCount?: number) => void;
}

const RepoContext = createContext<RepoContextValue | undefined>(undefined);

function loadStoredRepo(): RepoInfo | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_CURRENT_REPO);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.repoId === 'string' && typeof parsed.name === 'string') {
      return {
        repoId: parsed.repoId,
        name: parsed.name,
        path: parsed.path || '',
        status: 'ingesting',
        commitCount: 0,
      };
    }
  } catch {
    // Ignore localStorage parse error
  }
  return null;
}

function persistStoredRepo(repo: RepoInfo | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (repo) {
      window.localStorage.setItem(
        STORAGE_KEY_CURRENT_REPO,
        JSON.stringify({
          repoId: repo.repoId,
          name: repo.name,
          path: repo.path,
        })
      );
    } else {
      window.localStorage.removeItem(STORAGE_KEY_CURRENT_REPO);
    }
  } catch {
    // Ignore storage errors
  }
}

export const RepoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [repo, setRepoState] = useState<RepoInfo | null>(() => loadStoredRepo());

  // Re-check status on initial load once if stored repo exists
  useEffect(() => {
    if (!repo?.repoId) return;

    let isMounted = true;
    getRepoStatus({ repoId: repo.repoId })
      .then((status) => {
        if (!isMounted) return;
        setRepoState((prev) => {
          if (!prev || prev.repoId !== repo.repoId) return prev;
          return {
            ...prev,
            status: status.status || (status.pct >= 100 ? 'done' : 'ingesting'),
            commitCount: status.commit_count,
          };
        });
      })
      .catch(() => {
        if (!isMounted) return;
        setRepoState((prev) => {
          if (!prev || prev.repoId !== repo.repoId) return prev;
          return {
            ...prev,
            status: 'error',
          };
        });
      });

    return () => {
      isMounted = false;
    };
  }, [repo?.repoId]);

  const setRepo = useCallback((newRepo: RepoInfo | null) => {
    setRepoState(newRepo);
    persistStoredRepo(newRepo);
  }, []);

  const clearRepo = useCallback(() => {
    setRepoState(null);
    persistStoredRepo(null);
  }, []);

  const updateRepoStatus = useCallback(
    (status: 'ingesting' | 'done' | 'error', commitCount?: number) => {
      setRepoState((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status,
          commitCount: commitCount !== undefined ? commitCount : prev.commitCount,
        };
      });
    },
    []
  );

  // Fallback to 'sample-repo' ONLY when USE_MOCK is true
  const activeRepoId = useMemo(() => {
    if (repo?.repoId) return repo.repoId;
    return USE_MOCK ? 'sample-repo' : null;
  }, [repo?.repoId]);

  const value = useMemo<RepoContextValue>(
    () => ({
      repo,
      activeRepoId,
      setRepo,
      clearRepo,
      updateRepoStatus,
    }),
    [repo, activeRepoId, setRepo, clearRepo, updateRepoStatus]
  );

  return <RepoContext.Provider value={value}>{children}</RepoContext.Provider>;
};

export function useRepo(): RepoContextValue {
  const context = useContext(RepoContext);
  if (!context) {
    throw new Error('useRepo must be used within a RepoProvider');
  }
  return context;
}
