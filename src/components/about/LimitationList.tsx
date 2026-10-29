import React, { useState, useEffect } from 'react';
import {
  BarChart2,
  ChevronDown,
  ChevronUp,
  GitCommit,
  Layers,
  Zap,
} from 'lucide-react';
import { LimitationItem, LimitationArea } from '../../content/about';
import {
  filterLimitations,
  getAreaCounts,
  AreaFilter,
  toggleExpandedSet,
} from './aboutUtils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import './LimitationList.css';

interface LimitationListProps {
  items: LimitationItem[];
  highlightId?: string | null;
}

export const LimitationList: React.FC<LimitationListProps> = ({
  items,
  highlightId,
}) => {
  const [selectedArea, setSelectedArea] = useState<AreaFilter>('all');
  // First two open by default
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    return new Set(items.slice(0, 2).map((item) => item.id));
  });

  // If a hash was targeted, ensure that card is expanded and visible
  useEffect(() => {
    if (highlightId) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.add(highlightId);
        return next;
      });

      // Find the area of the highlighted item and switch to it if not 'all'
      const matched = items.find((i) => i.id === highlightId);
      if (matched && selectedArea !== 'all' && selectedArea !== matched.area) {
        setSelectedArea('all');
      }
    }
  }, [highlightId, items, selectedArea]);

  const counts = getAreaCounts(items);
  const filtered = filterLimitations(items, selectedArea);

  const allExpanded = filtered.every((item) => expandedIds.has(item.id));

  const handleToggleAll = () => {
    if (allExpanded) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(items.map((i) => i.id)));
    }
  };

  const handleToggleItem = (id: string) => {
    setExpandedIds((prev) => toggleExpandedSet(prev, id));
  };

  const filterTabs: { area: AreaFilter; label: string }[] = [
    { area: 'all', label: 'All' },
    { area: 'history', label: 'History' },
    { area: 'metrics', label: 'Metrics' },
    { area: 'performance', label: 'Performance' },
    { area: 'scope', label: 'Scope' },
  ];

  const getAreaIcon = (area: LimitationArea) => {
    switch (area) {
      case 'history':
        return <GitCommit size={16} className="area-icon area-icon-history" aria-hidden="true" />;
      case 'metrics':
        return <BarChart2 size={16} className="area-icon area-icon-metrics" aria-hidden="true" />;
      case 'performance':
        return <Zap size={16} className="area-icon area-icon-performance" aria-hidden="true" />;
      case 'scope':
        return <Layers size={16} className="area-icon area-icon-scope" aria-hidden="true" />;
    }
  };

  return (
    <div className="limitations-container">
      {/* Controls Bar: Area Filter Chips + Expand/Collapse Button */}
      <div className="limitations-controls-bar">
        <div
          className="limitations-filter-chips"
          role="tablist"
          aria-label="Filter limitations by area"
        >
          {filterTabs.map((tab) => {
            const isSelected = selectedArea === tab.area;
            return (
              <button
                key={tab.area}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`filter-chip ${isSelected ? 'is-active' : ''}`}
                onClick={() => setSelectedArea(tab.area)}
              >
                <span>{tab.label}</span>
                <span className="filter-chip-count">{counts[tab.area]}</span>
              </button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="md"
          onClick={handleToggleAll}
          className="expand-all-btn"
        >
          {allExpanded ? 'Collapse all' : 'Expand all'}
        </Button>
      </div>

      <div className="sr-only" aria-live="polite">
        Showing {filtered.length} of {items.length} limitations for category {selectedArea}
      </div>

      {/* Limitations Cards */}
      <div className="limitations-card-list">
        {filtered.map((item) => {
          const isExpanded = expandedIds.has(item.id);
          const isHighlighted = item.id === highlightId;

          return (
            <article
              key={item.id}
              id={item.id}
              className={`limitation-card ${isHighlighted ? 'is-highlighted' : ''}`}
            >
              <header className="limitation-card-header">
                <button
                  type="button"
                  className="limitation-toggle-trigger"
                  onClick={() => handleToggleItem(item.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`limitation-content-${item.id}`}
                >
                  <div className="limitation-title-group">
                    {getAreaIcon(item.area)}
                    <h3 className="limitation-title">{item.title}</h3>
                  </div>

                  <div className="limitation-header-meta">
                    <Badge variant="neutral" className="limitation-area-badge">
                      {item.area}
                    </Badge>
                    <span className="limitation-chevron" aria-hidden="true">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </div>
                </button>
              </header>

              {isExpanded && (
                <div
                  id={`limitation-content-${item.id}`}
                  className="limitation-card-body"
                >
                  <p className="limitation-description">{item.description}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
