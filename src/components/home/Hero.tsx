import React from 'react';
import { GitBranch, ArrowRight, BarChart2, HardDrive, ShieldCheck, Cpu } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { HeroPreview } from './HeroPreview';
import './Hero.css';

export const Hero: React.FC = () => {
  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      {/* Background Subtle Pattern & Blobs */}
      <div className="hero-background-pattern" aria-hidden="true" />
      <div className="hero-blob hero-blob-navy" aria-hidden="true" />
      <div className="hero-blob hero-blob-cyan" aria-hidden="true" />

      <div className="hero-content">
        {/* Left Column: Text & CTAs */}
        <div className="hero-text-col">
          {/* 1. Badge */}
          <div className="hero-anim-1">
            <Badge dot variant="neutral" icon={<GitBranch size={13} aria-hidden="true" />}>
              Free · Open source · Runs on your machine
            </Badge>
          </div>

          {/* 2. Headline */}
          <h1 id="hero-heading" className="hero-headline hero-anim-2">
            See your repository&apos;s{' '}
            <span className="hero-headline-gradient">history</span>, not just its
            commits.
          </h1>

          {/* 3. Subtext */}
          <p className="hero-subtext hero-anim-3">
            GitViz reads a local Git repository and turns it into an interactive
            commit graph, a file-by-file evolution timeline, and a health
            dashboard with churn and bus-factor estimates.
          </p>

          {/* 4. Action Buttons */}
          <div className="hero-actions hero-anim-4">
            <Button
              variant="primary"
              size="lg"
              to="/graph"
              trailingIcon={<ArrowRight size={18} />}
            >
              Open Commit Graph
            </Button>
            <Button
              variant="secondary"
              size="lg"
              to="/dashboard"
              leadingIcon={<BarChart2 size={18} />}
            >
              View Dashboard
            </Button>
          </div>

          {/* 5. Trust Notes Row */}
          <div className="hero-trust-row hero-anim-5">
            <div className="hero-trust-item">
              <HardDrive size={15} className="hero-trust-icon" aria-hidden="true" />
              <span>Runs locally</span>
            </div>
            <div className="hero-trust-item">
              <ShieldCheck size={15} className="hero-trust-icon" aria-hidden="true" />
              <span>Read-only on your repo</span>
            </div>
            <div className="hero-trust-item">
              <Cpu size={15} className="hero-trust-icon" aria-hidden="true" />
              <span>Numbers computed from Git, not guessed</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Preview */}
        <div className="hero-anim-preview">
          <HeroPreview />
        </div>
      </div>
    </section>
  );
};
