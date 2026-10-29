import React, { useEffect, useRef, useState } from 'react';
import {
  FolderGit2,
  Network,
  Download,
  ShieldCheck,
  Lock,
  SlidersHorizontal,
} from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CodeSnippet } from './CodeSnippet';
import './HowItWorks.css';

interface StepItem {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  detail: React.ReactNode;
}

const STEPS: StepItem[] = [
  {
    number: '01',
    title: 'Load a repository',
    description:
      'Give GitViz the path to a local Git folder. It reads the history in a single pass and shows progress while it imports.',
    icon: <FolderGit2 size={18} aria-hidden="true" />,
    detail: (
      <CodeSnippet code="~/projects/my-repo" label="Example path" />
    ),
  },
  {
    number: '02',
    title: 'Explore the history',
    description:
      'Open the commit graph, follow a single file through time, and check the health dashboard.',
    icon: <Network size={18} aria-hidden="true" />,
    detail: (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <Badge variant="info">Commit graph</Badge>
        <Badge variant="neutral">File evolution</Badge>
        <Badge variant="neutral">Health dashboard</Badge>
      </div>
    ),
  },
  {
    number: '03',
    title: 'Export what you find',
    description:
      'Save a snapshot of the metrics as JSON or CSV to share with your team or include in a report.',
    icon: <Download size={18} aria-hidden="true" />,
    detail: (
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <Badge variant="neutral">JSON</Badge>
        <Badge variant="neutral">CSV</Badge>
      </div>
    ),
  },
];

export const HowItWorks: React.FC = () => {
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
      className="how-it-works-section"
      aria-labelledby="how-it-works-heading"
    >
      <div className="home-page-container">
        {/* Section Heading */}
        <SectionHeading
          id="how-it-works-heading"
          eyebrow="How it works"
          title="From a local folder to answers in three steps"
          subtitle="GitViz reads your repository once and keeps everything on your machine."
          align="center"
        />

        {/* Steps List */}
        <ol className="how-steps-list">
          {STEPS.map((step, index) => (
            <li key={step.number} className="how-step-item">
              <div
                className={`how-step-card how-step-animated ${
                  isVisible ? 'how-step-visible' : ''
                }`}
                style={{
                  transitionDelay: `${index * 130}ms`,
                  width: '100%',
                }}
              >
                {/* Header: Numbered Circle + Icon */}
                <div className="how-step-header">
                  <div className="how-step-number" aria-hidden="true">
                    <span>{step.number}</span>
                  </div>
                  <div className="how-step-icon">
                    {step.icon}
                  </div>
                </div>

                {/* Step Title */}
                <h3 className="how-step-title">{step.title}</h3>

                {/* Description */}
                <p className="how-step-desc">{step.description}</p>

                {/* Step Detail Area */}
                <div className="how-step-detail">
                  {step.detail}
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* Trust Strip */}
        <Card className="how-trust-card">
          <div className="how-trust-items">
            <div className="how-trust-item">
              <ShieldCheck size={18} className="how-trust-icon" aria-hidden="true" />
              <span>Your code never leaves your machine</span>
            </div>
            <div className="how-trust-divider" aria-hidden="true" />
            <div className="how-trust-item">
              <Lock size={18} className="how-trust-icon" aria-hidden="true" />
              <span>Read-only: GitViz never changes your repository</span>
            </div>
            <div className="how-trust-divider" aria-hidden="true" />
            <div className="how-trust-item">
              <SlidersHorizontal size={18} className="how-trust-icon" aria-hidden="true" />
              <span>Ignored by default: lockfiles and build folders, editable by you</span>
            </div>
          </div>

          <p className="how-trust-disclaimer">
            Metrics are computed from Git data. Churn highlights files worth inspecting; it does not predict bugs.
          </p>
        </Card>
      </div>
    </section>
  );
};
