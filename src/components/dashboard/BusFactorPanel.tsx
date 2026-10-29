import React from 'react';
import { AlertCircle, HelpCircle, ShieldAlert } from 'lucide-react';
import { BusFactorResponse } from '../../api/types';
import { classifyBusFactor, formatPercent } from './metricsUtils';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import './BusFactorPanel.css';

interface BusFactorPanelProps {
  busFactor: BusFactorResponse;
  authorCount?: number;
}

export const BusFactorPanel: React.FC<BusFactorPanelProps> = ({
  busFactor,
  authorCount = 6,
}) => {
  const globalClassification = classifyBusFactor(busFactor.score);
  const isSingleAuthor = authorCount === 1 || (busFactor.score === 1 && authorCount === 1);

  return (
    <Card className="bus-factor-panel">
      {/* Panel Header */}
      <div className="bus-factor-header">
        <div className="bus-factor-title-group">
          <ShieldAlert size={18} className="bus-factor-icon" aria-hidden="true" />
          <h3 className="bus-factor-title">Bus Factor Analysis</h3>
        </div>
        <Badge variant="warning" className="estimate-pill">
          estimate
        </Badge>
      </div>

      {/* Main Score Hero */}
      <div className="bus-score-hero">
        <div className="bus-score-main">
          <span className="bus-score-number">{busFactor.score}</span>
          <div className="bus-score-meta">
            <Badge variant={globalClassification.level} className="bus-status-badge">
              {globalClassification.label}
            </Badge>
            <span className="bus-score-label">
              estimate (concentration of commits)
            </span>
          </div>
        </div>

        <p className="bus-score-disclaimer">
          Bus factor here measures how concentrated commits are among authors.
          It is not a measure of who actually knows the code.
        </p>

        {isSingleAuthor && (
          <div className="single-author-alert" role="status">
            <AlertCircle size={14} aria-hidden="true" />
            <span>Only one author found. Bus factor is 1 by definition.</span>
          </div>
        )}
      </div>

      {/* Module Breakdown */}
      <div className="bus-modules-section">
        <div className="bus-modules-heading">
          <span className="modules-title">Module Ownership Breakdown</span>
          <span className="modules-caption">
            <HelpCircle size={12} aria-hidden="true" />
            <span>Top author share (estimate)</span>
          </span>
        </div>

        <ul className="bus-module-list" aria-label="Module bus factor breakdown">
          {busFactor.modules.map((mod) => {
            const modClass = classifyBusFactor(mod.bus_factor);
            const sharePercent = formatPercent(mod.top_author_share);

            return (
              <li key={mod.path} className="bus-module-item">
                <div className="bus-module-header">
                  <code className="bus-module-path">{mod.path}</code>
                  <Badge variant={modClass.level} className="bus-module-chip">
                    {modClass.label} (score {mod.bus_factor})
                  </Badge>
                </div>

                <div className="bus-gauge-container">
                  <div className="bus-gauge-track" aria-hidden="true">
                    <div
                      className={`bus-gauge-bar bus-gauge-${modClass.level}`}
                      style={{ width: `${Math.min(100, Math.round(mod.top_author_share * 100))}%` }}
                    />
                  </div>
                  <div className="bus-gauge-info">
                    <span className="bus-gauge-author">
                      {mod.top_author}
                    </span>
                    <span className="bus-gauge-share">
                      {sharePercent} share (estimate)
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
};
