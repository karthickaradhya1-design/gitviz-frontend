import React from 'react';
import { Info, ShieldCheck, Database, SlidersHorizontal } from 'lucide-react';
import { Card } from '../ui/Card';
import { CodeSnippet } from '../home/CodeSnippet';
import './WhatHappensCard.css';

export const WhatHappensCard: React.FC = () => {
  return (
    <Card className="what-happens-card">
      <div className="what-happens-header">
        <div className="what-happens-icon-wrap" aria-hidden="true">
          <Info size={18} />
        </div>
        <h2 className="what-happens-title">What happens during import</h2>
      </div>

      <ol className="what-happens-list">
        <li className="what-happens-item">
          <div className="what-happens-step-badge" aria-hidden="true">1</div>
          <div className="what-happens-step-text">
            <div className="what-happens-step-heading">
              <ShieldCheck size={14} className="what-happens-step-icon" aria-hidden="true" />
              <strong>Read-only inspection</strong>
            </div>
            <p>GitViz reads the history in a single read-only pass.</p>
          </div>
        </li>

        <li className="what-happens-item">
          <div className="what-happens-step-badge" aria-hidden="true">2</div>
          <div className="what-happens-step-text">
            <div className="what-happens-step-heading">
              <Database size={14} className="what-happens-step-icon" aria-hidden="true" />
              <strong>Local caching</strong>
            </div>
            <p>The results are stored by the backend so pages can load quickly.</p>
          </div>
        </li>

        <li className="what-happens-item">
          <div className="what-happens-step-badge" aria-hidden="true">3</div>
          <div className="what-happens-step-text">
            <div className="what-happens-step-heading">
              <SlidersHorizontal size={14} className="what-happens-step-icon" aria-hidden="true" />
              <strong>Filtered noise</strong>
            </div>
            <p>Lockfiles and build folders are ignored by default so hotspots stay meaningful.</p>
          </div>
        </li>
      </ol>

      <div className="what-happens-note">
        <p>
          Import time depends on repository size and the machine. GitViz does not promise a specific speed.
        </p>
      </div>

      <div className="what-happens-example">
        <CodeSnippet code="~/projects/my-repo" label="Example path" />
      </div>
    </Card>
  );
};
