import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Check,
  Copy,
  FileCode,
  GitCommit,
  GitMerge,
  Info,
  Users,
} from 'lucide-react';
import { FileHistoryResponse } from '../../api/types';
import {
  computeFileSummary,
  filterHistoryEntries,
  formatDate,
} from './historyUtils';
import { TimelineEntry } from './TimelineEntry';
import { EmptyState } from '../states/EmptyState';
import { Button } from '../ui/Button';
import './FileTimeline.css';

interface FileTimelineProps {
  history: FileHistoryResponse;
}

export const FileTimeline: React.FC<FileTimelineProps> = ({ history }) => {
  const [showMerges, setShowMerges] = useState(true);
  const [copiedPath, setCopiedPath] = useState(false);

  // Aggregated metrics from entries
  const summary = useMemo(
    () => computeFileSummary(history.entries),
    [history.entries]
  );

  // Filtered entries according to merge toggle
  const filteredEntries = useMemo(
    () => filterHistoryEntries(history.entries, showMerges),
    [history.entries, showMerges]
  );

  const handleCopyPath = async () => {
    try {
      await navigator.clipboard.writeText(history.path);
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 2000);
    } catch {
      setCopiedPath(false);
    }
  };

  return (
    <div className="file-timeline-container">
      {/* File Summary Header Bar */}
      <div className="file-summary-bar">
        <div className="file-summary-top">
          <div className="file-title-group">
            <FileCode size={20} className="file-icon" aria-hidden="true" />
            <code className="file-path" title={history.path}>
              {history.path}
            </code>
            <button
              type="button"
              className="copy-path-btn"
              onClick={handleCopyPath}
              aria-label={copiedPath ? 'Path copied to clipboard' : 'Copy file path'}
            >
              {copiedPath ? (
                <>
                  <Check size={13} aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} aria-hidden="true" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <span className="sr-only" aria-live="polite">
              {copiedPath ? 'File path copied to clipboard' : ''}
            </span>
          </div>

          {/* Merge filter toggle */}
          <div className="merge-toggle-container">
            <label className="merge-toggle-label">
              <input
                type="checkbox"
                checked={showMerges}
                onChange={(e) => setShowMerges(e.target.checked)}
                className="merge-checkbox"
              />
              <GitMerge size={14} className="merge-icon" aria-hidden="true" />
              <span>Show merge commits</span>
            </label>
            <span
              className="merge-note"
              title="Linus Torvalds noted git log --follow skips merge commits. GitViz includes them by default, with this toggle to inspect direct changes only."
            >
              (toggle to isolate direct file edits)
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="file-stats-grid">
          <div className="file-stat-item">
            <GitCommit size={15} className="file-stat-icon" aria-hidden="true" />
            <div className="file-stat-content">
              <span className="file-stat-label">Commits</span>
              <span className="file-stat-value">{summary.totalCommits}</span>
            </div>
          </div>

          <div className="file-stat-item">
            <Users size={15} className="file-stat-icon" aria-hidden="true" />
            <div className="file-stat-content">
              <span className="file-stat-label">Contributors</span>
              <span className="file-stat-value">{summary.uniqueAuthorsCount}</span>
            </div>
          </div>

          <div className="file-stat-item">
            <Calendar size={15} className="file-stat-icon" aria-hidden="true" />
            <div className="file-stat-content">
              <span className="file-stat-label">Active Span</span>
              <span className="file-stat-value">
                {formatDate(summary.firstCommittedAt)} – {formatDate(summary.lastCommittedAt)}
              </span>
            </div>
          </div>

          <div className="file-stat-item">
            <div className="file-stat-content">
              <span className="file-stat-label">Total Churn</span>
              <span className="file-stat-value file-stat-churn">
                <span className="churn-add">+{summary.totalAdditions}</span>
                <span className="churn-del">-{summary.totalDeletions}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* History Incomplete Warning Banner */}
      {!history.history_complete && (
        <div className="history-incomplete-banner" role="alert">
          <Info size={16} className="incomplete-banner-icon" aria-hidden="true" />
          <div className="incomplete-banner-text">
            <strong>History cutoff:</strong> Earlier history for this file was not linked
            due to a rename detection threshold or shallow repository depth.
          </div>
        </div>
      )}

      {/* Timeline List or Empty Filter State */}
      {filteredEntries.length === 0 ? (
        <EmptyState
          icon={<GitCommit size={24} />}
          title="No commits to display"
          description={
            !showMerges
              ? 'All commits touching this file were merge commits. Enable "Show merge commits" to view them.'
              : 'No commits found for this file.'
          }
          action={
            !showMerges ? (
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowMerges(true)}
              >
                Show merge commits
              </Button>
            ) : undefined
          }
        />
      ) : (
        <ol
          className="file-timeline-list"
          aria-label={`Commit timeline for ${history.path}`}
        >
          {filteredEntries.map((entry, index) => (
            <TimelineEntry
              key={entry.sha}
              entry={entry}
              isLast={index === filteredEntries.length - 1}
            />
          ))}
        </ol>
      )}
    </div>
  );
};
