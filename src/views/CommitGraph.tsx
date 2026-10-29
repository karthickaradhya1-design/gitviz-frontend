import React, { useState, useMemo, useEffect } from 'react';
import { Database, FilterX } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useCommits } from '../api/hooks';
import { USE_MOCK } from '../api/client';
import { useRepo } from '../context/RepoContext';
import { Commit } from '../api/types';
import { GraphToolbar, GraphFilterState } from '../components/graph/GraphToolbar';
import { CommitList } from '../components/graph/CommitList';
import { CommitDetails } from '../components/graph/CommitDetails';
import { GraphLegend } from '../components/graph/GraphLegend';
import { computeCommitGraphLayout } from '../components/graph/layout/laneLayout';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/states';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import './CommitGraph.css';

const INITIAL_FILTERS: GraphFilterState = {
  searchQuery: '',
  selectedAuthor: 'all',
  selectedBranch: 'all',
  showMerges: true,
};

export const CommitGraph: React.FC = () => {
  usePageTitle('Commit Graph');
  const { activeRepoId } = useRepo();
  const { data, isLoading, error, refetch } = useCommits(activeRepoId || undefined);
  const [filters, setFilters] = useState<GraphFilterState>(INITIAL_FILTERS);
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null);
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

  const rawCommits = useMemo(() => data?.commits || [], [data?.commits]);

  // Compute graph layout ONCE for all loaded commits
  const graphLayout = useMemo(() => {
    return computeCommitGraphLayout(rawCommits);
  }, [rawCommits]);

  // Determine if any filter is active
  const filtersActive = useMemo(() => {
    return Boolean(
      filters.searchQuery.trim() ||
      filters.selectedAuthor !== 'all' ||
      filters.selectedBranch !== 'all' ||
      !filters.showMerges
    );
  }, [filters]);

  // Extract unique authors and branches for filter dropdowns
  const { authors, branches } = useMemo(() => {
    const authorSet = new Set<string>();
    const branchSet = new Set<string>();

    rawCommits.forEach((c) => {
      if (c.author?.name) authorSet.add(c.author.name);
      if (c.branch_hint) branchSet.add(c.branch_hint);
    });

    return {
      authors: Array.from(authorSet).sort(),
      branches: Array.from(branchSet).sort(),
    };
  }, [rawCommits]);

  // Client-side filtering
  const filteredCommits = useMemo(() => {
    return rawCommits.filter((commit) => {
      // 1. Merge filter
      if (!filters.showMerges && commit.is_merge) {
        return false;
      }

      // 2. Author filter
      if (
        filters.selectedAuthor !== 'all' &&
        commit.author.name !== filters.selectedAuthor
      ) {
        return false;
      }

      // 3. Branch filter
      if (
        filters.selectedBranch !== 'all' &&
        commit.branch_hint !== filters.selectedBranch
      ) {
        return false;
      }

      // 4. Search query filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const msgMatch = commit.message.toLowerCase().includes(query);
        const shaMatch =
          commit.short_sha.toLowerCase().includes(query) ||
          commit.sha.toLowerCase().includes(query);
        const authorMatch = commit.author.name.toLowerCase().includes(query);
        if (!msgMatch && !shaMatch && !authorMatch) {
          return false;
        }
      }

      return true;
    });
  }, [rawCommits, filters]);

  // Default to selecting first commit when commits load
  useEffect(() => {
    if (filteredCommits.length > 0 && !selectedCommit) {
      setSelectedCommit(filteredCommits[0]);
    } else if (
      selectedCommit &&
      !filteredCommits.some((c) => c.sha === selectedCommit.sha)
    ) {
      setSelectedCommit(filteredCommits[0] || null);
    }
  }, [filteredCommits, selectedCommit]);

  const handleSelectCommit = (commit: Commit) => {
    setSelectedCommit(commit);
    setMobileDetailsOpen(true);
  };

  const handleSelectSha = (sha: string) => {
    const target = rawCommits.find(
      (c) => c.sha === sha || c.short_sha === sha
    );
    if (target) {
      setSelectedCommit(target);
      setMobileDetailsOpen(true);
    }
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className="commit-graph-view">
      <div className="commit-graph-page-container">
        {/* Page Header */}
        <div className="commit-graph-header">
          <div className="commit-graph-header-left">
            <div className="commit-graph-title-row">
              <h1 className="commit-graph-title">Commit Graph</h1>
              {USE_MOCK && (
                <Badge variant="info" icon={<Database size={12} />}>
                  Sample data
                </Badge>
              )}
            </div>
            <p className="commit-graph-subtitle">
              Explore branches, merges and individual commits.
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <GraphToolbar
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={handleResetFilters}
          authors={authors}
          branches={branches}
          totalCount={rawCommits.length}
          filteredCount={filteredCommits.length}
        />

        {/* Legend and Filter Notice Banner */}
        <GraphLegend
          filtersActive={filtersActive}
          onResetFilters={handleResetFilters}
        />

        {/* States & Main Content */}
        {isLoading ? (
          <LoadingSkeleton rows={8} />
        ) : error ? (
          <ErrorState
            title="Could not load commits"
            description={
              error.message ||
              'The API did not respond. Check that the backend is running, or switch USE_MOCK on in src/api/client.ts.'
            }
            onRetry={() => refetch()}
          />
        ) : (!activeRepoId || rawCommits.length === 0) ? (
          <EmptyState
            title={!activeRepoId ? "No repository loaded" : "No commits to show"}
            description={
              !activeRepoId
                ? "Load a repository to explore its branches, merges and commits."
                : "Load a repository to see its history. An empty repository has no commits yet."
            }
            action={
              <Button to="/load" variant="primary" size="md">
                Load a repository
              </Button>
            }
          />
        ) : filteredCommits.length === 0 ? (
          <EmptyState
            icon={<FilterX size={24} />}
            title="No commits match your filters"
            description="Try clearing your search query or adjusting the author and branch filters."
            action={
              <Button
                variant="secondary"
                size="md"
                onClick={handleResetFilters}
              >
                Reset filters
              </Button>
            }
          />
        ) : (
          /* Split Layout: Virtualized List + Details Panel */
          <div className="commit-graph-layout">
            <div className="commit-graph-list-col">
              <CommitList
                commits={filteredCommits}
                layouts={graphLayout.layouts}
                selectedCommit={selectedCommit}
                onSelectCommit={handleSelectCommit}
                filtersActive={filtersActive}
                gutterWidth={graphLayout.gutterWidth}
                nextCursor={data?.next_cursor || null}
              />
            </div>

            <div
              className={`commit-graph-details-col ${
                mobileDetailsOpen ? 'mobile-open' : ''
              }`}
            >
              <CommitDetails
                commit={selectedCommit}
                onClose={() => setMobileDetailsOpen(false)}
                onSelectSha={handleSelectSha}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommitGraph;
