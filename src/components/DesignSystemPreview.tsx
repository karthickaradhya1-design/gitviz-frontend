import React from 'react';
import {
  GitCommit,
  GitBranch,
  GitMerge,
  FileCode,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from './ThemeProvider';

interface ColorSwatch {
  name: string;
  variable: string;
  hexLight: string;
  hexDark: string;
  note?: string;
}

export const DesignSystemPreview: React.FC = () => {
  const { theme } = useTheme();

  const baseSwatches: ColorSwatch[] = [
    { name: 'Background', variable: '--color-bg', hexLight: '#FFFFFF', hexDark: '#071426', note: 'App foundation' },
    { name: 'Surface', variable: '--color-surface', hexLight: '#F5F8FC', hexDark: '#0D2038', note: 'Card & panel containers' },
    { name: 'Border', variable: '--color-border', hexLight: '#DCE4EE', hexDark: '#1C3556', note: 'Separators & outlines' },
    { name: 'Text Primary', variable: '--color-text-primary', hexLight: '#0B1F3A', hexDark: '#EAF1FB', note: 'High-contrast headings & text' },
    { name: 'Text Secondary', variable: '--color-text-secondary', hexLight: '#52627A', hexDark: '#9DB0C9', note: 'Subtitles & metadata (> 4.5:1)' },
    { name: 'Primary (Navy)', variable: '--color-primary', hexLight: '#003366', hexDark: '#4DA3FF', note: 'Brand foundation & key CTAs' },
    { name: 'Primary Strong', variable: '--color-primary-strong', hexLight: '#002244', hexDark: '#70B4FF', note: 'Hover & deep accentuation' },
    { name: 'Accent (Cyan)', variable: '--color-accent', hexLight: '#00AEEF', hexDark: '#22C7FF', note: 'Icons, borders, focus highlights only' },
    { name: 'Link / Button Blue', variable: '--color-link', hexLight: '#004F9F', hexDark: '#4DA3FF', note: 'Interactive text links & buttons' },
  ];

  const semanticSwatches: ColorSwatch[] = [
    { name: 'Success', variable: '--color-success', hexLight: '#1FA971', hexDark: '#2ECC71', note: 'Clean status, tests green' },
    { name: 'Warning', variable: '--color-warning', hexLight: '#F5A623', hexDark: '#F5A623', note: 'Hotspots, attention needed' },
    { name: 'Danger', variable: '--color-danger', hexLight: '#E5484D', hexDark: '#FF5A5F', note: 'History break, high churn alert' },
    { name: 'Info / Cyan', variable: '--color-info', hexLight: '#00AEEF', hexDark: '#22C7FF', note: 'Informative hints & inspect targets' },
  ];

  const laneSwatches: { id: number; name: string; variable: string; lightHex: string; darkHex: string }[] = [
    { id: 1, name: 'Lane 1 (Cobalt)', variable: '--lane-1', lightHex: '#1D70B8', darkHex: '#4DA3FF' },
    { id: 2, name: 'Lane 2 (Amber / Ochre)', variable: '--lane-2', lightHex: '#E67E22', darkHex: '#F59E0B' },
    { id: 3, name: 'Lane 3 (Emerald)', variable: '--lane-3', lightHex: '#10B981', darkHex: '#34D399' },
    { id: 4, name: 'Lane 4 (Purple)', variable: '--lane-4', lightHex: '#9333EA', darkHex: '#C084FC' },
    { id: 5, name: 'Lane 5 (Crimson)', variable: '--lane-5', lightHex: '#E11D48', darkHex: '#FB7185' },
    { id: 6, name: 'Lane 6 (Cyan Sky)', variable: '--lane-6', lightHex: '#0284C7', darkHex: '#22D3EE' },
    { id: 7, name: 'Lane 7 (Gold)', variable: '--lane-7', lightHex: '#D97706', darkHex: '#FBBF24' },
    { id: 8, name: 'Lane 8 (Indigo)', variable: '--lane-8', lightHex: '#6366F1', darkHex: '#818CF8' },
  ];

  const typeScales = [
    { label: 'Display 4XL', size: '2.25rem (36px)', weight: '700', sample: 'GitViz Git Analytics', varName: '--text-4xl' },
    { label: 'Heading 3XL', size: '1.875rem (30px)', weight: '700', sample: 'Repository Health Dashboard', varName: '--text-3xl' },
    { label: 'Heading 2XL', size: '1.5rem (24px)', weight: '600', sample: 'Commit History DAG & Evolution', varName: '--text-2xl' },
    { label: 'Heading XL', size: '1.25rem (20px)', weight: '600', sample: 'Top 10 File Churn Candidates', varName: '--text-xl' },
    { label: 'Heading LG', size: '1.125rem (18px)', weight: '600', sample: 'Branch & Merge Lane Analysis', varName: '--text-lg' },
    { label: 'Body Base', size: '1rem (16px)', weight: '400', sample: 'All metric numbers reconcile with automated count. No unmeasured claims.', varName: '--text-base' },
    { label: 'Body SM', size: '0.875rem (14px)', weight: '400', sample: 'Bus factor score is an estimate based on commit concentration.', varName: '--text-sm' },
    { label: 'Caption XS', size: '0.75rem (12px)', weight: '500', sample: 'LAST REVISION: 2026-10-29 · COMMITS COUNT: 4,821', varName: '--text-xs' },
  ];

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
      {/* Top Header Bar */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: 'var(--space-6)',
          marginBottom: 'var(--space-8)',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <GitBranch size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--text-3xl)', margin: 0 }}>GitViz Design System</h1>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Navy + Cyan Palette · Typography Tokens · Accessible Contrast (≥ 4.5:1)
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span className="badge badge-neutral">Active: {theme.toUpperCase()}</span>
          <ThemeToggle />
        </div>
      </header>

      {/* Honest UI Principles Banner */}
      <section
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderLeft: '4px solid var(--color-accent)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-5)',
          marginBottom: 'var(--space-8)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
          <ShieldCheck size={22} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>
              Honest UI Principles Built-In
            </h4>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              No marketing hyperbole (&ldquo;blazing&rdquo;, &ldquo;first ever&rdquo;). Performance claims are grounded in measured data.
              Bus factor is clearly labeled as an estimate. High churn is highlighted as a review candidate, not an automated prediction of failure.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 1: Base Palette & Dual Theme Swatches */}
      <section style={{ marginBottom: 'var(--space-12)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-4)' }}>
          <h2>1. Color Palette (Navy + Cyan Base)</h2>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Comparing Light &amp; Dark Theme Values
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          {baseSwatches.map((swatch) => (
            <div
              key={swatch.variable}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                padding: 'var(--space-4)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                  {swatch.name}
                </strong>
                <code className="code-token">{swatch.variable}</code>
              </div>

              {/* Side-by-Side Theme Previews */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                {/* Light swatch box */}
                <div
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #DCE4EE',
                    padding: 'var(--space-3)',
                    background: '#FFFFFF',
                    color: '#0B1F3A',
                  }}
                >
                  <div
                    style={{
                      height: '32px',
                      borderRadius: 'var(--radius-sm)',
                      background: swatch.hexLight,
                      border: swatch.hexLight === '#FFFFFF' ? '1px solid #DCE4EE' : 'none',
                      marginBottom: 'var(--space-2)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  />
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: '#0B1F3A' }}>
                    Light: {swatch.hexLight}
                  </div>
                </div>

                {/* Dark swatch box */}
                <div
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #1C3556',
                    padding: 'var(--space-3)',
                    background: '#071426',
                    color: '#EAF1FB',
                  }}
                >
                  <div
                    style={{
                      height: '32px',
                      borderRadius: 'var(--radius-sm)',
                      background: swatch.hexDark,
                      border: '1px solid #1C3556',
                      marginBottom: 'var(--space-2)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  />
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: '#EAF1FB' }}>
                    Dark: {swatch.hexDark}
                  </div>
                </div>
              </div>

              {swatch.note && (
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                  {swatch.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Semantic Colors */}
      <section style={{ marginBottom: 'var(--space-12)' }}>
        <h2 style={{ marginBottom: 'var(--space-4)' }}>2. Semantic Status &amp; Feedback</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          {semanticSwatches.map((sem) => (
            <div key={sem.variable} className="card" style={{ padding: 'var(--space-4)' }}>
              <div
                style={{
                  height: '42px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: `var(${sem.variable})`,
                  marginBottom: 'var(--space-3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 'var(--font-semibold)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                {sem.name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{sem.name}</span>
                <code className="code-token">{sem.variable}</code>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', color: 'var(--color-text-muted)' }}>
                {sem.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Commit Graph 8 Lanes */}
      <section style={{ marginBottom: 'var(--space-12)' }}>
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <h2>3. Commit Graph Lanes (8 Tracks)</h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Colorblind-friendly, highly distinguishable lanes for git branch and merge DAG visualization.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: 'var(--space-3)',
          }}
        >
          {laneSwatches.map((lane) => (
            <div
              key={lane.id}
              className="card"
              style={{
                padding: 'var(--space-3)',
                textAlign: 'center',
                borderTop: `4px solid var(${lane.variable})`,
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: `var(${lane.variable})`,
                  margin: '0 auto var(--space-2) auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <GitCommit size={18} />
              </div>
              <div style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-xs)' }}>
                Lane {lane.id}
              </div>
              <code className="code-token" style={{ marginTop: 'var(--space-1)', fontSize: '10px' }}>
                {lane.variable}
              </code>
            </div>
          ))}
        </div>

        {/* Lane Path Mockup */}
        <div
          className="card"
          style={{
            marginTop: 'var(--space-4)',
            padding: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            overflowX: 'auto',
          }}
        >
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-muted)' }}>
            DAG SIMULATION:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {laneSwatches.map((lane, index) => (
              <div key={lane.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: `var(${lane.variable})`,
                    boxShadow: `0 0 0 2px var(--color-surface), 0 0 0 3px var(${lane.variable})`,
                  }}
                />
                <span
                  style={{
                    width: '36px',
                    height: '2px',
                    backgroundColor: `var(${lane.variable})`,
                  }}
                />
                {index === 2 && <GitMerge size={14} style={{ color: `var(${lane.variable})` }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Typography & Fonts */}
      <section style={{ marginBottom: 'var(--space-12)' }}>
        <h2 style={{ marginBottom: 'var(--space-2)' }}>4. Typography Scale &amp; Dual Fonts</h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
          <strong>Inter</strong> for UI copy and clarity; <strong>JetBrains Mono</strong> for commit SHAs, branch names, and file paths.
        </p>

        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {typeScales.map((ts) => (
              <div
                key={ts.varName}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr',
                  alignItems: 'baseline',
                  gap: 'var(--space-4)',
                  borderBottom: '1px solid var(--color-border-subtle)',
                  paddingBottom: 'var(--space-4)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>
                    {ts.label}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    {ts.size} · {ts.varName}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: `var(${ts.varName})`,
                    fontWeight: ts.weight,
                    color: 'var(--color-text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {ts.sample}
                </div>
              </div>
            ))}

            {/* JetBrains Mono Showcase */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr',
                alignItems: 'baseline',
                gap: 'var(--space-4)',
                paddingTop: 'var(--space-2)',
              }}
            >
              <div>
                <div style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>
                  JetBrains Mono
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  Code, SHAs, paths
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center' }}>
                <span className="code-token" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <GitCommit size={12} /> commit a9f7e21
                </span>
                <span className="code-token">
                  tree c54d19b78e34a02
                </span>
                <span className="code-token" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <FileCode size={12} /> src/api/client.ts
                </span>
                <span className="code-token">
                  git log --numstat --date=iso
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Sample Interactive Buttons */}
      <section style={{ marginBottom: 'var(--space-12)' }}>
        <h2 style={{ marginBottom: 'var(--space-2)' }}>5. Interactive Button Variants</h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
          Tested for visible keyboard focus ring (:focus-visible) and WCAG AA contrast.
        </p>

        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'center' }}>
            <button type="button" className="btn btn-primary">
              <GitBranch size={16} /> Primary Button
            </button>
            <button type="button" className="btn btn-secondary">
              <FileCode size={16} /> Secondary Button
            </button>
            <button type="button" className="btn btn-outline">
              <ExternalLink size={16} /> Outline Action
            </button>
            <button type="button" className="btn btn-danger">
              <AlertTriangle size={16} /> Danger Action
            </button>
            <button type="button" className="btn btn-primary" disabled>
              Disabled State
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6: Sample Card Component Preview */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ marginBottom: 'var(--space-4)' }}>6. Sample Card &amp; Data Display</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
          {/* Card 1: Commit Item */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--lane-1)',
                    display: 'inline-block',
                  }}
                />
                <span className="code-token">sha: 4e91ac2</span>
                <span className="badge badge-success">
                  <CheckCircle2 size={12} /> verified
                </span>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                3 hours ago
              </span>
            </div>

            <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)' }}>
              Refactor API client to single choke point
            </h4>
            <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
              Ensures browser never contacts Git or database directly. Ready for mock-to-real flip.
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--color-border-subtle)',
                paddingTop: 'var(--space-3)',
                fontSize: 'var(--text-xs)',
              }}
            >
              <span style={{ color: 'var(--color-text-secondary)' }}>Author: Alex Rivera</span>
              <span style={{ color: 'var(--color-success)', fontWeight: 'var(--font-semibold)' }}>+48 / -12 lines</span>
            </div>
          </div>

          {/* Card 2: Hotspot Metric Card with Honest Disclaimer */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
              <span className="badge badge-warning">
                <AlertTriangle size={12} /> Hotspot — Inspect This
              </span>
              <span className="code-token">src/core/router.ts</span>
            </div>

            <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)' }}>
              High Churn Candidate
            </h4>
            <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
              42 commits across last 90 days. Churn indicates frequent modification, not an automated prediction of bugs.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                background: 'var(--color-warning-bg)',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-primary)',
              }}
            >
              <Info size={14} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
              <span>Bus Factor: <strong>1.0 (estimate: 88% commits by 1 author)</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: 'var(--space-6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--text-xs)',
        }}
      >
        <div>GitViz P3 Frontend · Design System Preview &amp; Verification</div>
        <div>Stack: React 18 · Vite · TypeScript · CSS Custom Properties</div>
      </footer>
    </div>
  );
};
