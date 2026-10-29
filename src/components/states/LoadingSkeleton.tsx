import React from 'react';
import './States.css';

interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  rows = 6,
  className = '',
}) => {
  return (
    <div
      className={`skeleton-container ${className}`.trim()}
      role="status"
      aria-label="Loading content..."
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row skeleton-shimmer">
          {/* Mock Gutter */}
          <div
            className="skeleton-block"
            style={{ width: '120px', height: '14px', flexShrink: 0 }}
          />
          {/* Mock SHA */}
          <div
            className="skeleton-block"
            style={{ width: '64px', height: '14px', flexShrink: 0 }}
          />
          {/* Mock Message */}
          <div
            className="skeleton-block"
            style={{ width: `${40 + (i % 4) * 12}%`, height: '14px' }}
          />
          <div style={{ flex: 1 }} />
          {/* Mock Branch Badge */}
          <div
            className="skeleton-block"
            style={{ width: '56px', height: '18px', flexShrink: 0 }}
          />
          {/* Mock Author */}
          <div
            className="skeleton-block"
            style={{ width: '80px', height: '14px', flexShrink: 0 }}
          />
          {/* Mock Date */}
          <div
            className="skeleton-block"
            style={{ width: '70px', height: '14px', flexShrink: 0 }}
          />
        </div>
      ))}
      <span className="sr-only">Loading commits...</span>
    </div>
  );
};
