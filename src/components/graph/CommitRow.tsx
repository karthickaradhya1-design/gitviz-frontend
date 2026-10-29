import React, { useState } from 'react';
import { GitMerge, Check, Copy } from 'lucide-react';
import { Commit } from '../../api/types';
import { Badge } from '../ui/Badge';
import './CommitRow.css';

interface CommitRowProps {
  commit: Commit;
  isSelected: boolean;
  onSelect: (commit: Commit) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

/** Get initials and consistent lane color for author avatar */
function getAuthorAvatar(name: string): { initials: string; colorVar: string } {
  const parts = name.trim().split(/\s+/);
  const initials =
    parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();

  // Consistent hash to select one of 8 lane colors
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const laneIndex = (Math.abs(hash) % 8) + 1;
  return { initials, colorVar: `var(--lane-${laneIndex})` };
}

/** Format relative time */
function formatRelativeDate(isoDate: string): string {
  const now = new Date('2026-10-29T20:00:00Z').getTime(); // anchored to project timeline
  const past = new Date(isoDate).getTime();
  const diffSec = Math.max(0, Math.floor((now - past) / 1000));

  if (diffSec < 3600) {
    const mins = Math.max(1, Math.floor(diffSec / 60));
    return `${mins}m ago`;
  }
  if (diffSec < 86400) {
    const hours = Math.floor(diffSec / 3600);
    return `${hours}h ago`;
  }
  const days = Math.floor(diffSec / 86400);
  if (days < 30) {
    return `${days}d ago`;
  }
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export const CommitRow: React.FC<CommitRowProps> = ({
  commit,
  isSelected,
  onSelect,
  onKeyDown,
}) => {
  const [copied, setCopied] = useState(false);
  const { initials, colorVar } = getAuthorAvatar(commit.author.name);
  const relativeDate = formatRelativeDate(commit.committed_at);
  const fullDate = new Date(commit.committed_at).toLocaleString();

  const handleCopySha = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(commit.sha);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div
      className={`commit-row ${isSelected ? 'is-selected' : ''}`}
      onClick={() => onSelect(commit)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(commit);
        }
        if (onKeyDown) onKeyDown(e);
      }}
      tabIndex={0}
      role="row"
      aria-selected={isSelected}
      aria-label={`Commit ${commit.short_sha}: ${commit.message} by ${commit.author.name}`}
    >
      {/* 1. Reserved Graph Gutter (120px) where lane drawing will happen later */}
      <div
        className="commit-gutter"
        data-graph-gutter="true"
        data-sha={commit.short_sha}
        aria-hidden="true"
      />

      {/* 2. Row Content */}
      <div className="commit-row-content">
        {/* Short SHA Chip */}
        <button
          type="button"
          onClick={handleCopySha}
          className={`commit-sha-chip ${copied ? 'copied' : ''}`}
          title={`Full SHA: ${commit.sha} (Click to copy)`}
          aria-label={`Copy SHA ${commit.short_sha}`}
        >
          {copied ? (
            <>
              <Check size={11} aria-hidden="true" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={11} aria-hidden="true" />
              <span>{commit.short_sha}</span>
            </>
          )}
        </button>

        {/* Commit Message */}
        <div className="commit-message-wrap">
          <span className="commit-message" title={commit.message}>
            {commit.message}
          </span>
        </div>

        {/* Branch / Merge Badges */}
        <div className="commit-badges">
          {commit.is_merge && (
            <Badge variant="warning" icon={<GitMerge size={11} />}>
              Merge
            </Badge>
          )}
          {commit.branch_hint && (
            <Badge variant="neutral">
              {commit.branch_hint}
            </Badge>
          )}
        </div>

        {/* Author Avatar & Name */}
        <div className="commit-author-group" title={`${commit.author.name} <${commit.author.email}>`}>
          <div
            className="commit-author-avatar"
            style={{ backgroundColor: colorVar }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <span className="commit-author-name">{commit.author.name}</span>
        </div>

        {/* Relative Date */}
        <div className="commit-date" title={fullDate}>
          {relativeDate}
        </div>
      </div>
    </div>
  );
};
