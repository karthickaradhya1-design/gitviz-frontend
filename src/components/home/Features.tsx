import React, { useEffect, useRef, useState } from 'react';
import {
  GitBranch,
  FileClock,
  Activity,
  Info,
  ArrowRight,
  Download,
} from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import './Features.css';

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  to: string;
  linkText: string;
  icon: React.ReactNode;
  limitationText: string;
  renderIllustration: () => React.ReactNode;
}

const FEATURES: FeatureItem[] = [
  {
    id: 'graph',
    title: 'Commit Graph',
    description:
      'See branches, merges and lanes as an interactive graph. Click any commit to inspect its details.',
    to: '/graph',
    linkText: 'Explore Commit Graph',
    icon: <GitBranch size={20} aria-hidden="true" />,
    limitationText:
      'Rendering is virtualized, so only visible commits are drawn. Supported history size depends on measured results.',
    renderIllustration: () => (
      <svg
        width="180"
        height="64"
        viewBox="0 0 180 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Lane 0 (Cobalt Main) */}
        <line x1="36" y1="4" x2="36" y2="60" stroke="var(--lane-1)" strokeWidth="2.5" />

        {/* Lane 1 (Orange Feature): curves & merges into Lane 0 */}
        <path
          d="M 90,60 L 90,40 C 90,20 36,28 36,16"
          stroke="var(--lane-2)"
          strokeWidth="2"
          fill="none"
        />

        {/* Lane 2 (Emerald Hotfix) */}
        <path
          d="M 36,46 C 36,36 144,36 144,24 L 144,4"
          stroke="var(--lane-3)"
          strokeWidth="2"
          fill="none"
        />

        {/* Nodes */}
        <circle cx="36" cy="16" r="4.5" fill="var(--color-surface)" stroke="var(--lane-1)" strokeWidth="2.5" />
        <circle cx="90" cy="40" r="4" fill="var(--color-surface)" stroke="var(--lane-2)" strokeWidth="2" />
        <circle cx="144" cy="24" r="4" fill="var(--color-surface)" stroke="var(--lane-3)" strokeWidth="2" />
        <circle cx="36" cy="46" r="4" fill="var(--color-surface)" stroke="var(--lane-1)" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'files',
    title: 'File Evolution',
    description:
      'Pick a file and follow every commit that touched it, in order, with a diff preview.',
    to: '/files',
    linkText: 'Follow File History',
    icon: <FileClock size={20} aria-hidden="true" />,
    limitationText:
      'If Git cannot detect a rename, the history shows a visible break instead of a guessed link.',
    renderIllustration: () => (
      <svg
        width="220"
        height="64"
        viewBox="0 0 220 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Continuous segment between Node 1 and Node 2 */}
        <line x1="28" y1="32" x2="76" y2="32" stroke="var(--lane-1)" strokeWidth="2.5" />

        {/* Broken rename gap between x=76 and x=144 with warning dashed indicator */}
        <line
          x1="80"
          y1="32"
          x2="140"
          y2="32"
          stroke="var(--color-warning)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Break indicator marks */}
        <line x1="106" y1="24" x2="114" y2="40" stroke="var(--color-warning)" strokeWidth="2" />
        <line x1="112" y1="24" x2="120" y2="40" stroke="var(--color-warning)" strokeWidth="2" />

        {/* Continuous segment between Node 3 and Node 4 */}
        <line x1="144" y1="32" x2="192" y2="32" stroke="var(--lane-6)" strokeWidth="2.5" />

        {/* Timeline nodes */}
        <circle cx="28" cy="32" r="4.5" fill="var(--color-surface)" stroke="var(--lane-1)" strokeWidth="2.5" />
        <circle cx="76" cy="32" r="4.5" fill="var(--color-surface)" stroke="var(--lane-1)" strokeWidth="2.5" />
        <circle cx="144" cy="32" r="4.5" fill="var(--color-surface)" stroke="var(--lane-6)" strokeWidth="2.5" />
        <circle cx="192" cy="32" r="4.5" fill="var(--color-surface)" stroke="var(--lane-6)" strokeWidth="2.5" />

        {/* Small label for rename break */}
        <text
          x="110"
          y="18"
          fill="var(--color-warning)"
          fontSize="9"
          fontFamily="var(--font-mono)"
          textAnchor="middle"
          fontWeight="600"
        >
          break
        </text>
      </svg>
    ),
  },
  {
    id: 'dashboard',
    title: 'Health Dashboard',
    description:
      'Spot churn hotspots, commits per author and churn over time at a glance.',
    to: '/dashboard',
    linkText: 'Inspect Codebase Health',
    icon: <Activity size={20} aria-hidden="true" />,
    limitationText:
      'Bus factor is an estimate based on commit concentration. A hotspot means inspect this, not this will break.',
    renderIllustration: () => (
      <svg
        width="190"
        height="64"
        viewBox="0 0 190 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Baseline grid */}
        <line x1="16" y1="54" x2="174" y2="54" stroke="var(--color-border)" strokeWidth="1" />
        <line x1="16" y1="32" x2="174" y2="32" stroke="var(--color-border-subtle)" strokeWidth="1" strokeDasharray="3 3" />

        {/* 5 Chart Bars in navy-to-cyan tones */}
        <rect x="26" y="24" width="18" height="30" rx="3" fill="var(--color-primary)" opacity="0.9" />
        <rect x="56" y="10" width="18" height="44" rx="3" fill="var(--color-link)" opacity="0.9" />
        <rect x="86" y="20" width="18" height="34" rx="3" fill="var(--color-accent)" opacity="0.95" />
        <rect x="116" y="32" width="18" height="22" rx="3" fill="var(--lane-6)" opacity="0.85" />
        <rect x="146" y="14" width="18" height="40" rx="3" fill="var(--lane-1)" opacity="0.9" />
      </svg>
    ),
  },
];

export const Features: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="features-section"
      aria-labelledby="features-heading"
    >
      {/* Reusable Section Heading */}
      <SectionHeading
        id="features-heading"
        eyebrow="What you get"
        title="Three views of the same history"
        subtitle="Load a local repository once, then explore it as a graph, as a file timeline, and as a health dashboard."
        align="center"
      />

      {/* 3-Card Responsive Grid */}
      <div className="features-grid">
        {FEATURES.map((feature, index) => (
          <Card
            key={feature.id}
            to={feature.to}
            interactive
            className={`feature-card feature-card-animated ${
              isVisible ? 'feature-card-visible' : ''
            }`}
            style={{ transitionDelay: `${index * 130}ms` }}
            aria-label={`${feature.title} - ${feature.description}`}
          >
            {/* Top SVG Illustration */}
            <div className="feature-illustration-wrapper">
              {feature.renderIllustration()}
            </div>

            {/* Header: Icon & Title */}
            <div className="feature-header-row">
              <div className="feature-icon-badge">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
            </div>

            {/* 2-line Description */}
            <p className="feature-description">{feature.description}</p>

            {/* Limitation Box ("Good to know") */}
            <div className="feature-limitation-box" role="note">
              <Info size={14} className="feature-limitation-icon" aria-hidden="true" />
              <div className="feature-limitation-content">
                <span className="feature-limitation-label">Good to know</span>
                <span className="feature-limitation-text">
                  {feature.limitationText}
                </span>
              </div>
            </div>

            {/* Text Link with Arrow */}
            <div className="feature-action-link">
              <span>{feature.linkText}</span>
              <ArrowRight size={16} className="feature-action-arrow" aria-hidden="true" />
            </div>
          </Card>
        ))}
      </div>

      {/* Slim Full-Width Export Strip */}
      <div className="features-export-strip">
        <div className="export-strip-left">
          <div className="export-strip-icon-box" aria-hidden="true">
            <Download size={18} />
          </div>
          <span className="export-strip-text">
            Export a snapshot of your repository metrics as JSON or CSV
          </span>
        </div>

        <Button
          variant="ghost"
          size="md"
          to="/dashboard"
          trailingIcon={<ArrowRight size={16} />}
        >
          Open Dashboard
        </Button>
      </div>
    </section>
  );
};
