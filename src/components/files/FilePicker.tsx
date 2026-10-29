import React, { useState, useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { FileCode, Flame, Search, X } from 'lucide-react';
import { FileSummary } from '../../api/types';
import './FilePicker.css';

interface FilePickerProps {
  files: FileSummary[];
  selectedPath: string | null;
  onSelectPath: (path: string) => void;
  className?: string;
}

type SortOption = 'commits-desc' | 'recent-desc' | 'alpha-asc';

export const FilePicker: React.FC<FilePickerProps> = ({
  files,
  selectedPath,
  onSelectPath,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('commits-desc');
  const parentRef = useRef<HTMLDivElement>(null);

  // Identify top 3 hotspot files by commit count across the whole repository
  const hotspotPaths = useMemo(() => {
    const sortedByCommits = [...files].sort(
      (a, b) => b.commit_count - a.commit_count
    );
    const top3 = sortedByCommits.slice(0, 3).map((f) => f.path);
    return new Set(top3);
  }, [files]);

  // Filter and sort files
  const filteredAndSortedFiles = useMemo(() => {
    let result = files;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((f) => f.path.toLowerCase().includes(query));
    }

    return [...result].sort((a, b) => {
      if (sortBy === 'commits-desc') {
        return b.commit_count - a.commit_count;
      }
      if (sortBy === 'recent-desc') {
        const timeA = new Date(a.last_touch_at).getTime();
        const timeB = new Date(b.last_touch_at).getTime();
        return timeB - timeA;
      }
      if (sortBy === 'alpha-asc') {
        return a.path.localeCompare(b.path);
      }
      return 0;
    });
  }, [files, searchQuery, sortBy]);

  // Virtualizer for the files list
  const rowVirtualizer = useVirtualizer({
    count: filteredAndSortedFiles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 54,
    overscan: 6,
  });

  return (
    <div className={`file-picker ${className}`.trim()}>
      <div className="file-picker-header">
        <div className="file-picker-title-row">
          <span className="file-picker-title">Repository Files</span>
          <span className="file-picker-count-badge">
            {filteredAndSortedFiles.length} of {files.length}
          </span>
        </div>

        {/* Search Input */}
        <div className="file-search-container">
          <Search size={14} className="file-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="file-search-input"
            placeholder="Filter files by path..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Filter files by path"
          />
          {searchQuery && (
            <button
              type="button"
              className="file-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear file search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="file-sort-container">
          <label htmlFor="file-sort-select" className="file-sort-label">
            Sort:
          </label>
          <select
            id="file-sort-select"
            className="file-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="commits-desc">Most commits</option>
            <option value="recent-desc">Recently changed</option>
            <option value="alpha-asc">Path (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Virtualized File List */}
      <div
        ref={parentRef}
        className="file-picker-list"
        role="listbox"
        aria-label="Tracked files"
      >
        {filteredAndSortedFiles.length === 0 ? (
          <div className="file-picker-empty">
            <span>No files match "{searchQuery}"</span>
          </div>
        ) : (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const file = filteredAndSortedFiles[virtualRow.index];
              const isSelected = file.path === selectedPath;
              const isHotspot = hotspotPaths.has(file.path);

              // Split directory and basename for clarity
              const lastSlash = file.path.lastIndexOf('/');
              const dir = lastSlash !== -1 ? file.path.slice(0, lastSlash + 1) : '';
              const filename = lastSlash !== -1 ? file.path.slice(lastSlash + 1) : file.path;

              return (
                <div
                  key={file.path}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onSelectPath(file.path)}
                  className={`file-picker-item ${isSelected ? 'is-selected' : ''}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="file-item-icon-wrapper">
                    <FileCode size={15} className="file-item-icon" aria-hidden="true" />
                  </div>

                  <div className="file-item-info">
                    <div className="file-item-path" title={file.path}>
                      {dir && <span className="file-item-dir">{dir}</span>}
                      <span className="file-item-name">{filename}</span>
                    </div>

                    <div className="file-item-meta">
                      <span className="file-item-commits">
                        {file.commit_count} {file.commit_count === 1 ? 'commit' : 'commits'}
                      </span>

                      {isHotspot && (
                        <span
                          className="file-hotspot-pill"
                          title="Hotspot — inspect this (high commit churn)"
                        >
                          <Flame size={10} aria-hidden="true" />
                          <span>Hotspot</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
