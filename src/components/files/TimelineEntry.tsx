import React, { useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  GitCommit,
  GitMerge,
  HelpCircle,
} from 'lucide-react';
import { FileHistoryEntry } from '../../api/types';
import { formatDate } from './historyUtils';
import { Badge } from '../ui/Badge';
import { DiffPreview } from './DiffPreview';
import './TimelineEntry.css';

interface TimelineEntryProps {
  entry: FileHistoryEntry;
  isLast?: boolean;
}

export const TimelineEntry: React.FC<TimelineEntryProps> = ({
  entry,
  isLast = false,
}) => {
  const [isDiffExpanded, setIsDiffExpanded] = useState(false);
  const [isWhyBreakOpen, setIsWhyBreakOpen] = useState(false);

  // Author initials for avatar
  const initials = entry.author?.name
    ? entry.author.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '??';

  return (
    <li className={`timeline-item ${entry.break_after ? 'has-break' : ''}`}>
      {/* Vertical Spine and Node */}
      <div className="timeline-spine">
        <div
          className={`timeline-node ${entry.is_merge ? 'node-merge' : ''}`}
          aria-hidden="true"
        >
          {entry.is_merge ? <GitMerge size={12} /> : <GitCommit size={12} />}
        </div>
        {!isLast && <div className="timeline-line" aria-hidden="true" />}
      </div>

      {/* Main Commit Card */}
      <div className="timeline-content">
        <div className="timeline-card">
          <div className="timeline-card-header">
            <div className="timeline-meta-left">
              <div
                className="timeline-avatar"
                title={`${entry.author?.name} <${entry.author?.email}>`}
              >
                {initials}
              </div>
              <div className="timeline-author-info">
                <span className="timeline-author-name">{entry.author?.name}</span>
                <time
                  className="timeline-date"
                  dateTime={entry.committed_at}
                  title={entry.committed_at}
                >
                  {formatDate(entry.committed_at)}
                </time>
              </div>
            </div>

            <div className="timeline-meta-right">
              {entry.is_merge && (
                <Badge variant="warning">
                  merge
                </Badge>
              )}
              {entry.old_path && (
                <span title={`Renamed from ${entry.old_path}`}>
                  <Badge variant="info">
                    Renamed from {entry.old_path}
                  </Badge>
                </span>
              )}
              <code className="timeline-sha" title={entry.sha}>
                {entry.short_sha}
              </code>
            </div>
          </div>

          <div className="timeline-message">
            <p>{entry.message}</p>
          </div>

          <div className="timeline-card-footer">
            <div className="timeline-diff-stats" aria-label={`Churn: +${entry.additions} -${entry.deletions}`}>
              <span className="stat-add">+{entry.additions}</span>
              <span className="stat-del">-{entry.deletions}</span>
            </div>

            {entry.diff && (
              <button
                type="button"
                className="timeline-toggle-diff-btn"
                onClick={() => setIsDiffExpanded(!isDiffExpanded)}
                aria-expanded={isDiffExpanded}
              >
                <span>{isDiffExpanded ? 'Hide changes' : 'Inspect diff'}</span>
                {isDiffExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>

          {/* Expandable Unified Diff */}
          {isDiffExpanded && entry.diff && (
            <DiffPreview diff={entry.diff} />
          )}
        </div>

        {/* History Break Notice Card when Git loses rename track */}
        {entry.break_after && (
          <div className="history-break-container" role="region" aria-label="History break warning">
            <div className="history-break-spine-break" aria-hidden="true">
              <div className="history-break-dashed-line" />
            </div>

            <div className="history-break-card">
              <div className="history-break-header">
                <AlertTriangle size={18} className="history-break-icon" aria-hidden="true" />
                <div className="history-break-title-group">
                  <h4 className="history-break-title">History break: rename detection cutoff</h4>
                  <p className="history-break-description">{entry.break_after}</p>
                </div>
              </div>

              <div className="history-break-explanation">
                <button
                  type="button"
                  className="history-break-why-toggle"
                  onClick={() => setIsWhyBreakOpen(!isWhyBreakOpen)}
                  aria-expanded={isWhyBreakOpen}
                >
                  <HelpCircle size={14} />
                  <span>Why did Git lose track here?</span>
                  {isWhyBreakOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>

                {isWhyBreakOpen && (
                  <div className="history-break-details-content">
                    <p>
                      Git does not record file renames as explicit events in commit metadata. Instead,
                      it computes similarity heuristics between deleted and added files during log generation.
                    </p>
                    <p>
                      If a file undergoes heavy structural refactoring or rewrite while being renamed,
                      its similarity score drops below the detection threshold. Linus Torvalds noted that
                      tracing renames across complex histories can skip lineages or merge branches.
                    </p>
                    <p className="history-break-honest-note">
                      <strong>GitViz limitation:</strong> We display this break honestly rather than fabricating
                      an unverified historical connection.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </li>
  );
};
