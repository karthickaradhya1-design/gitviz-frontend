import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, HelpCircle } from 'lucide-react';
import './GraphLegend.css';

interface GraphLegendProps {
  filtersActive: boolean;
  onResetFilters: () => void;
}

export const GraphLegend: React.FC<GraphLegendProps> = ({
  filtersActive,
  onResetFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="graph-legend-container">
      {/* Notice shown when filters hide lanes */}
      {filtersActive && (
        <div className="graph-filter-notice" role="status">
          <div className="graph-filter-notice-left">
            <Info size={15} aria-hidden="true" />
            <span>
              Filters are on, so the graph lines are hidden. Reset filters to see
              branches and merges.
            </span>
          </div>
          <button
            type="button"
            onClick={onResetFilters}
            className="graph-filter-reset-link"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Collapsible Legend Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="graph-legend-toggle"
          aria-expanded={isOpen}
          aria-controls="graph-legend-details"
        >
          <HelpCircle size={14} aria-hidden="true" />
          <span>Graph legend</span>
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
          Some overlap may occur on very merge-heavy histories.
        </span>
      </div>

      {/* Collapsible Panel */}
      {isOpen && (
        <div id="graph-legend-details" className="graph-legend-panel">
          <div className="graph-legend-items">
            <div className="graph-legend-item">
              <span className="graph-legend-icon-sample" aria-hidden="true">
                <span className="graph-legend-dot" />
              </span>
              <span>Commit</span>
            </div>

            <div className="graph-legend-item">
              <span className="graph-legend-icon-sample" aria-hidden="true">
                <span className="graph-legend-ring" />
              </span>
              <span>Merge commit</span>
            </div>

            <div className="graph-legend-item">
              <span className="graph-legend-icon-sample" aria-hidden="true">
                <span className="graph-legend-square" />
              </span>
              <span>First (root) commit</span>
            </div>

            <div className="graph-legend-item">
              <span className="graph-legend-icon-sample" aria-hidden="true">
                <span className="graph-legend-faded-line" />
              </span>
              <span>History continues below</span>
            </div>
          </div>

          <div className="graph-legend-notes">
            <span>
              Lane colors identify branch lines only; they do not carry meaning between sessions.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
