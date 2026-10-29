import React from 'react';
import { Search, ChevronDown, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import './GraphToolbar.css';

export interface GraphFilterState {
  searchQuery: string;
  selectedAuthor: string;
  selectedBranch: string;
  showMerges: boolean;
}

interface GraphToolbarProps {
  filters: GraphFilterState;
  onFilterChange: (filters: GraphFilterState) => void;
  onResetFilters: () => void;
  authors: string[];
  branches: string[];
  totalCount: number;
  filteredCount: number;
}

export const GraphToolbar: React.FC<GraphToolbarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  authors,
  branches,
  totalCount,
  filteredCount,
}) => {
  const isFilterActive =
    Boolean(filters.searchQuery) ||
    filters.selectedAuthor !== 'all' ||
    filters.selectedBranch !== 'all' ||
    !filters.showMerges;

  return (
    <div className="graph-toolbar" role="toolbar" aria-label="Commit graph filtering controls">
      <div className="graph-toolbar-inner">
        <div className="graph-toolbar-filters">
          {/* Search Box */}
          <div className="graph-search-box">
            <Search size={15} className="graph-search-icon" aria-hidden="true" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) =>
                onFilterChange({ ...filters, searchQuery: e.target.value })
              }
              placeholder="Filter by message or SHA..."
              className="graph-search-input"
              aria-label="Filter commits by commit message or SHA"
            />
          </div>

          {/* Author Select */}
          <div className="graph-select-wrapper">
            <select
              value={filters.selectedAuthor}
              onChange={(e) =>
                onFilterChange({ ...filters, selectedAuthor: e.target.value })
              }
              className="graph-select"
              aria-label="Filter by author"
            >
              <option value="all">All authors ({authors.length})</option>
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="graph-select-chevron" aria-hidden="true" />
          </div>

          {/* Branch Select */}
          <div className="graph-select-wrapper">
            <select
              value={filters.selectedBranch}
              onChange={(e) =>
                onFilterChange({ ...filters, selectedBranch: e.target.value })
              }
              className="graph-select"
              aria-label="Filter by branch"
            >
              <option value="all">All branches ({branches.length})</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="graph-select-chevron" aria-hidden="true" />
          </div>

          {/* Show Merges Toggle */}
          <label className="graph-toggle-label" title="Toggle visibility of merge commits">
            <input
              type="checkbox"
              checked={filters.showMerges}
              onChange={(e) =>
                onFilterChange({ ...filters, showMerges: e.target.checked })
              }
              className="graph-toggle-checkbox"
              aria-label="Show merge commits"
            />
            <span className="graph-toggle-switch" aria-hidden="true" />
            <span>Merge commits</span>
          </label>
        </div>

        {/* Right Status Count & Reset Button */}
        <div className="graph-toolbar-meta">
          <span className="graph-result-counter" aria-live="polite">
            {filteredCount} of {totalCount} commits
          </span>

          {isFilterActive && (
            <Button
              variant="ghost"
              size="md"
              onClick={onResetFilters}
              className="graph-reset-btn"
              leadingIcon={<RotateCcw size={12} />}
              aria-label="Reset all commit filters"
            >
              Reset filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
