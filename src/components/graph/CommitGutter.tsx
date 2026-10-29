import React from 'react';
import { CommitRowLayout, NODE_RADIUS, ROW_HEIGHT } from './layout/laneLayout';
import './CommitGutter.css';

interface CommitGutterProps {
  layout?: CommitRowLayout;
  isSelected?: boolean;
  filtersActive?: boolean;
  gutterWidth: number;
}

export const CommitGutter: React.FC<CommitGutterProps> = ({
  layout,
  isSelected = false,
  filtersActive = false,
  gutterWidth,
}) => {
  if (!layout) {
    return <div className="commit-gutter" style={{ width: `${gutterWidth}px` }} />;
  }

  const { nodePoint, colorVar, nodeType, segments } = layout;

  return (
    <div
      className="commit-gutter"
      style={{ width: `${gutterWidth}px`, minWidth: `${gutterWidth}px` }}
      data-graph-gutter="true"
      data-sha={layout.sha}
      aria-hidden="true"
    >
      <svg
        className="commit-gutter-svg"
        viewBox={`0 0 ${gutterWidth} ${ROW_HEIGHT}`}
        width={gutterWidth}
        height={ROW_HEIGHT}
        aria-hidden="true"
      >
        {/* Draw lane lines ONLY when filters are NOT active */}
        {!filtersActive && (
          <g className="graph-segments-group">
            {segments.map((seg) => {
              const isOutgoing =
                seg.from.x === nodePoint.x && seg.from.y === nodePoint.y;
              const isHighlighted = isSelected && isOutgoing;

              if (seg.type === 'straight') {
                return (
                  <line
                    key={seg.id}
                    x1={seg.from.x}
                    y1={seg.from.y}
                    x2={seg.to.x}
                    y2={seg.to.y}
                    stroke={seg.colorVar}
                    strokeWidth={isHighlighted ? 3 : 2}
                    strokeLinecap="round"
                    className={`graph-segment ${
                      isHighlighted ? 'graph-segment-highlighted' : ''
                    }`}
                  />
                );
              }

              if (seg.type === 'curve' && seg.control1 && seg.control2) {
                const d = `M ${seg.from.x} ${seg.from.y} C ${seg.control1.x} ${seg.control1.y}, ${seg.control2.x} ${seg.control2.y}, ${seg.to.x} ${seg.to.y}`;
                return (
                  <path
                    key={seg.id}
                    d={d}
                    fill="none"
                    stroke={seg.colorVar}
                    strokeWidth={isHighlighted ? 3 : 2}
                    strokeLinecap="round"
                    className={`graph-segment ${
                      isHighlighted ? 'graph-segment-highlighted' : ''
                    }`}
                  />
                );
              }

              if (seg.type === 'fade-out') {
                return (
                  <line
                    key={seg.id}
                    x1={seg.from.x}
                    y1={seg.from.y}
                    x2={seg.to.x}
                    y2={seg.to.y}
                    stroke={seg.colorVar}
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    opacity={0.5}
                    className="graph-segment graph-segment-fade"
                  />
                );
              }

              return null;
            })}
          </g>
        )}

        {/* Selected Commit Node Glow Ring */}
        {isSelected && (
          <circle
            cx={filtersActive ? gutterWidth / 2 : nodePoint.x}
            cy={nodePoint.y}
            r={NODE_RADIUS + 4}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            className="graph-node-selected-glow"
          />
        )}

        {/* Node Representation */}
        {filtersActive ? (
          /* Simple Dot when filters are active */
          <g className="graph-node">
            <circle
              cx={gutterWidth / 2}
              cy={nodePoint.y}
              r={NODE_RADIUS}
              fill={colorVar}
              stroke="var(--color-surface)"
              strokeWidth="2"
            />
          </g>
        ) : nodeType === 'merge' ? (
          /* Merge Commit: Hollow Ring with Center Dot */
          <g className="graph-node">
            <circle
              cx={nodePoint.x}
              cy={nodePoint.y}
              r={NODE_RADIUS + 2}
              fill="var(--color-surface)"
              stroke={colorVar}
              strokeWidth="2.5"
            />
            <circle
              cx={nodePoint.x}
              cy={nodePoint.y}
              r={2}
              fill={colorVar}
            />
          </g>
        ) : nodeType === 'root' ? (
          /* Root Commit: Distinct Rounded Square Node */
          <g className="graph-node">
            <rect
              x={nodePoint.x - 5}
              y={nodePoint.y - 5}
              width={10}
              height={10}
              rx={2}
              fill="var(--color-surface)"
              stroke={colorVar}
              strokeWidth="2.5"
            />
            <circle
              cx={nodePoint.x}
              cy={nodePoint.y}
              r={1.8}
              fill={colorVar}
            />
          </g>
        ) : (
          /* Normal Commit: Filled Circle with Surface Ring */
          <g className="graph-node">
            <circle
              cx={nodePoint.x}
              cy={nodePoint.y}
              r={NODE_RADIUS + 1.5}
              fill="var(--color-surface)"
            />
            <circle
              cx={nodePoint.x}
              cy={nodePoint.y}
              r={NODE_RADIUS}
              fill={colorVar}
              stroke="var(--color-surface)"
              strokeWidth="1.5"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
