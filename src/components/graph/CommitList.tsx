import React, { useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronDown } from 'lucide-react';
import { Commit } from '../../api/types';
import { CommitRowLayout } from './layout/laneLayout';
import { CommitRow } from './CommitRow';
import { Button } from '../ui/Button';
import './CommitList.css';

interface CommitListProps {
  commits: Commit[];
  layouts: Map<string, CommitRowLayout>;
  selectedCommit: Commit | null;
  onSelectCommit: (commit: Commit) => void;
  filtersActive: boolean;
  gutterWidth: number;
  nextCursor: string | null;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export const CommitList: React.FC<CommitListProps> = ({
  commits,
  layouts,
  selectedCommit,
  onSelectCommit,
  filtersActive,
  gutterWidth,
  nextCursor,
  onLoadMore,
  isLoadingMore = false,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: commits.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 6,
  });

  // Handle keyboard Up/Down navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!commits.length) return;
    const currentIndex = selectedCommit
      ? commits.findIndex((c) => c.sha === selectedCommit.sha)
      : -1;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.min(commits.length - 1, currentIndex + 1);
      onSelectCommit(commits[nextIndex]);
      rowVirtualizer.scrollToIndex(nextIndex, { align: 'auto' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = Math.max(0, currentIndex - 1);
      onSelectCommit(commits[prevIndex]);
      rowVirtualizer.scrollToIndex(prevIndex, { align: 'auto' });
    }
  };

  // Scroll to selected commit if selected externally
  useEffect(() => {
    if (selectedCommit) {
      const idx = commits.findIndex((c) => c.sha === selectedCommit.sha);
      if (idx !== -1) {
        rowVirtualizer.scrollToIndex(idx, { align: 'auto' });
      }
    }
  }, [selectedCommit?.sha]);

  return (
    <div className="commit-list-container" onKeyDown={handleKeyDown}>
      {/* Column Headers with Dynamic Gutter Width */}
      <div className="commit-list-header" aria-hidden="true">
        <div
          className="commit-list-header-gutter"
          style={{ width: `${gutterWidth}px`, minWidth: `${gutterWidth}px` }}
        >
          Graph
        </div>
        <div className="commit-list-header-content">
          <span className="commit-list-header-sha">SHA</span>
          <span className="commit-list-header-msg">Message</span>
          <span className="commit-list-header-author">Author</span>
          <span className="commit-list-header-date">Date</span>
        </div>
      </div>

      {/* Virtualized Scroll Viewport */}
      <div
        ref={parentRef}
        className="commit-list-viewport"
        tabIndex={0}
        role="grid"
        aria-label="Commit history list"
        aria-rowcount={commits.length}
      >
        <div
          className="commit-virtual-wrapper"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const commit = commits[virtualRow.index];
            const isSelected = selectedCommit?.sha === commit.sha;
            const layout = layouts.get(commit.sha);

            return (
              <div
                key={commit.sha}
                className="commit-virtual-row-item"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <CommitRow
                  commit={commit}
                  layout={layout}
                  isSelected={isSelected}
                  filtersActive={filtersActive}
                  gutterWidth={gutterWidth}
                  onSelect={onSelectCommit}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Load More Button at Bottom (if cursor exists) */}
      {nextCursor && onLoadMore && (
        <div className="commit-list-load-more">
          <Button
            variant="secondary"
            size="md"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            leadingIcon={<ChevronDown size={16} />}
            aria-label="Load more commits via cursor pagination"
          >
            {isLoadingMore ? 'Loading commits...' : 'Load more commits'}
          </Button>
        </div>
      )}
    </div>
  );
};
