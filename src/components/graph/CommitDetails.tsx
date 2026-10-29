import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  GitCommit,
  GitMerge,
  Info,
  FileCode,
} from 'lucide-react';
import { Commit } from '../../api/types';
import { useCommit } from '../../api/hooks';
import { Badge } from '../ui/Badge';
import './CommitDetails.css';

interface CommitDetailsProps {
  commit: Commit | null;
  onClose?: () => void;
  onSelectSha?: (sha: string) => void;
  repoId?: string;
}

export const CommitDetails: React.FC<CommitDetailsProps> = ({
  commit,
  onClose,
  onSelectSha,
  repoId = 'default',
}) => {
  const [copiedSha, setCopiedSha] = useState(false);

  // Fetch detailed commit files
  const { data: detail, isLoading } = useCommit(repoId, commit?.sha);

  const handleCopySha = () => {
    if (!commit) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(commit.sha);
      }
      setCopiedSha(true);
      setTimeout(() => setCopiedSha(false), 2000);
    } catch {
      // fallback
    }
  };

  // If no commit selected yet, display placeholder
  if (!commit) {
    return (
      <aside className="commit-details-panel" aria-label="Commit details placeholder">
        <div className="commit-details-placeholder">
          <div className="commit-details-placeholder-icon" aria-hidden="true">
            <GitCommit size={28} />
          </div>
          <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>
            Commit Details
          </h4>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
            Select a commit from the graph list to see its message, parents, and file changes.
          </p>
        </div>
      </aside>
    );
  }

  const activeCommit = detail || commit;
  const files = detail?.files || [];

  return (
    <aside
      className="commit-details-panel"
      role="region"
      aria-label={`Details for commit ${commit.short_sha}`}
    >
      {/* Title Bar */}
      <div className="commit-details-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <h3 className="commit-details-title">Commit Details</h3>
          {activeCommit.is_merge && (
            <Badge variant="warning" icon={<GitMerge size={11} />}>
              Merge
            </Badge>
          )}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="commit-details-close-btn"
            aria-label="Close commit details panel"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Panel Scrollable Body */}
      <div className="commit-details-body">
        {/* Full Message */}
        <div className="commit-details-msg-box">
          <p className="commit-details-full-msg">{activeCommit.message}</p>
        </div>

        {/* Metadata Grid */}
        <div className="commit-details-meta-grid">
          {/* Full SHA with Copy Button */}
          <div className="commit-meta-row">
            <span className="commit-meta-label">SHA</span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 8px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <code style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                {activeCommit.sha}
              </code>
              <button
                type="button"
                onClick={handleCopySha}
                className="btn btn-ghost"
                style={{ padding: '2px 6px', height: 'auto', fontSize: '11px' }}
                aria-label="Copy full commit SHA"
              >
                {copiedSha ? (
                  <Check size={13} style={{ color: 'var(--color-success)' }} />
                ) : (
                  <Copy size={13} />
                )}
              </button>
            </div>
          </div>

          {/* Author */}
          <div className="commit-meta-row">
            <span className="commit-meta-label">Author</span>
            <span className="commit-meta-value">
              <strong>{activeCommit.author.name}</strong> &lt;
              {activeCommit.author.email}&gt;
            </span>
          </div>

          {/* Committed Date */}
          <div className="commit-meta-row">
            <span className="commit-meta-label">Committed At</span>
            <span className="commit-meta-value">
              {new Date(activeCommit.committed_at).toUTCString()}
            </span>
          </div>

          {/* Parent Commits */}
          <div className="commit-meta-row">
            <span className="commit-meta-label">
              Parents ({activeCommit.parents.length})
            </span>
            {activeCommit.parents.length === 0 ? (
              <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                (Root commit — no parents)
              </span>
            ) : (
              <div className="commit-parents-list">
                {activeCommit.parents.map((pSha, idx) => (
                  <div key={pSha} className="commit-parent-chip">
                    <span className="commit-parent-label">
                      {activeCommit.is_merge
                        ? idx === 0
                          ? 'Parent 1 (first parent)'
                          : 'Parent 2'
                        : `Parent ${idx + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectSha?.(pSha)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'var(--color-link)',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                      title={`Inspect parent ${pSha.slice(0, 7)}`}
                    >
                      {pSha.slice(0, 7)}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Diff Summary */}
          <div className="commit-meta-row">
            <span className="commit-meta-label">Changes</span>
            <div className="commit-diff-summary">
              <span className="diff-adds">+{activeCommit.additions} lines</span>
              <span>·</span>
              <span className="diff-dels">-{activeCommit.deletions} lines</span>
              <span>·</span>
              <span>{activeCommit.files_changed} files</span>
            </div>
          </div>
        </div>

        {/* Changed Files Section */}
        <div className="commit-files-section">
          <span className="commit-meta-label">Changed Files</span>

          {isLoading ? (
            <div style={{ padding: 'var(--space-3) 0', color: 'var(--color-text-muted)', fontSize: '12px' }}>
              Loading file diff preview...
            </div>
          ) : files.length === 0 ? (
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              No file diff details available.
            </p>
          ) : (
            <ul className="commit-files-list">
              {files.map((file) => (
                <li key={file.path} className="commit-file-item">
                  <div className="commit-file-main-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                      <FileCode size={13} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                      <span className="commit-file-path" title={file.path}>
                        {file.path}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
                      {file.is_binary && (
                        <Badge variant="warning">Binary</Badge>
                      )}
                      <span className="diff-adds" style={{ fontSize: '11px' }}>
                        +{file.additions}
                      </span>
                      <span className="diff-dels" style={{ fontSize: '11px' }}>
                        -{file.deletions}
                      </span>
                    </div>
                  </div>

                  {file.old_path && (
                    <div className="commit-file-rename">
                      <span>renamed from</span>
                      <code>{file.old_path}</code>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Info Note Callout */}
        <div className="commit-details-info-note" role="note">
          <Info size={14} aria-hidden="true" />
          <span>
            Merge commits are tagged. Whether they count toward churn is
            decided by the metrics backend.
          </span>
        </div>
      </div>
    </aside>
  );
};
