import React from 'react';
import { GitBranch, AlertTriangle, Users } from 'lucide-react';
import './HeroPreview.css';

interface CommitItem {
  sha: string;
  message: string;
  time: string;
}

const SAMPLE_COMMITS: CommitItem[] = [
  { sha: 'a9f7e21', message: "Merge branch 'feature/graph-dag'", time: '2h ago' },
  { sha: '7c32e01', message: 'Optimize virtualized DAG rendering', time: '5h ago' },
  { sha: 'b14d89a', message: 'Add bus-factor concentration logic', time: '1d ago' },
  { sha: '4e91ac2', message: 'Freeze REST API shape with P1/P2', time: '2d ago' },
  { sha: 'd38f2b7', message: 'Add rename break detector for file history', time: '3d ago' },
  { sha: '180e45c', message: 'Curate default lockfile ignore list', time: '4d ago' },
  { sha: '5a29f34', message: 'Initial commit: client choke point', time: '5d ago' },
];

export const HeroPreview: React.FC = () => {
  return (
    <div className="hero-preview-wrapper">
      {/* Soft radial glow behind card */}
      <div className="hero-preview-glow" aria-hidden="true" />

      {/* Mock Window Card */}
      <div className="hero-preview-card" role="region" aria-label="GitViz Interactive Commit Graph Preview">
        {/* Title Bar */}
        <div className="hero-preview-titlebar">
          <div className="hero-preview-dots" aria-hidden="true">
            <span className="hero-preview-dot dot-close" />
            <span className="hero-preview-dot dot-minimize" />
            <span className="hero-preview-dot dot-maximize" />
          </div>

          <div className="hero-preview-title">
            <GitBranch size={13} aria-hidden="true" style={{ color: 'var(--color-accent)' }} />
            <span>gitviz · sample-repo</span>
            <span className="hero-preview-branch-tag">main</span>
          </div>

          <div style={{ width: '42px' }} />
        </div>

        {/* Content: Continuous Commit Graph + Rows */}
        <div className="hero-preview-content">
          <div style={{ display: 'flex', alignItems: 'stretch' }}>
            {/* Unified Continuous SVG Graph Column */}
            <div style={{ width: '88px', flexShrink: 0 }} aria-hidden="true">
              <svg
                width="88"
                height="252"
                viewBox="0 0 88 252"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: 'block' }}
              >
                {/* Lane 0 (Main): Continuous vertical path */}
                <line
                  x1="18"
                  y1="0"
                  x2="18"
                  y2="252"
                  stroke="var(--lane-1)"
                  strokeWidth="2.5"
                  strokeOpacity="0.85"
                />

                {/* Lane 1 (Feature): Branch from Lane 0 at y=126 and merge back at y=18 */}
                <path
                  d="M 18,126 C 18,98 48,106 48,86 L 48,54 C 48,36 18,36 18,18"
                  fill="none"
                  stroke="var(--lane-2)"
                  strokeWidth="2"
                  strokeOpacity="0.85"
                />

                {/* Lane 2 (Hotfix / Metrics): Branch from Lane 0 at y=162 and merge to Lane 1 at y=54 */}
                <path
                  d="M 18,162 C 18,135 74,135 74,110 L 74,90 C 74,72 48,72 48,54"
                  fill="none"
                  stroke="var(--lane-3)"
                  strokeWidth="2"
                  strokeOpacity="0.85"
                />

                {/* Commit Nodes */}
                {/* Row 0: Merge commit on Lane 0 */}
                <circle cx="18" cy="18" r="4.5" fill="var(--color-surface)" stroke="var(--lane-1)" strokeWidth="2.5" />

                {/* Row 1: Feature commit on Lane 1 */}
                <circle cx="48" cy="54" r="4.5" fill="var(--color-surface)" stroke="var(--lane-2)" strokeWidth="2.5" />

                {/* Row 2: Metrics commit on Lane 2 */}
                <circle cx="74" cy="90" r="4.5" fill="var(--color-surface)" stroke="var(--lane-3)" strokeWidth="2.5" />

                {/* Row 3: Branch point commit on Lane 0 */}
                <circle cx="18" cy="126" r="4.5" fill="var(--color-surface)" stroke="var(--lane-1)" strokeWidth="2.5" />

                {/* Row 4: Ingest commit on Lane 0 */}
                <circle cx="18" cy="162" r="4.5" fill="var(--color-surface)" stroke="var(--lane-1)" strokeWidth="2.5" />

                {/* Row 5: Ignore list commit on Lane 0 */}
                <circle cx="18" cy="198" r="4.5" fill="var(--color-surface)" stroke="var(--lane-1)" strokeWidth="2.5" />

                {/* Row 6: Initial commit on Lane 0 */}
                <circle cx="18" cy="234" r="4.5" fill="var(--color-surface)" stroke="var(--lane-1)" strokeWidth="2.5" />
              </svg>
            </div>

            {/* Commit Message Rows */}
            <div className="hero-graph-rows" style={{ flex: 1, minWidth: 0 }}>
              {SAMPLE_COMMITS.map((commit) => (
                <div key={commit.sha} className="hero-graph-row">
                  <span className="hero-graph-sha">{commit.sha}</span>
                  <span className="hero-graph-message" title={commit.message}>
                    {commit.message}
                  </span>
                  <span className="hero-graph-time">{commit.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Mini Stat Chips Strip */}
        <div className="hero-preview-stats-strip">
          <div className="hero-stat-chip hotspot" title="High churn inspect candidate">
            <AlertTriangle size={13} style={{ color: 'var(--color-warning)' }} aria-hidden="true" />
            <span>Top hotspot: src/core/router.ts</span>
          </div>

          <div className="hero-stat-chip bus-factor" title="Estimated commit concentration">
            <Users size={13} style={{ color: 'var(--color-info)' }} aria-hidden="true" />
            <span>Bus factor: 1.0 (estimate)</span>
          </div>
        </div>
      </div>

      {/* Honest UI Disclaimer Label */}
      <p className="hero-preview-disclaimer">
        Illustration with sample data
      </p>
    </div>
  );
};
