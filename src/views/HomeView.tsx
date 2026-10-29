import React from 'react';

export const HomeView: React.FC = () => {
  return (
    <div className="card" style={{ maxWidth: '800px', margin: 'var(--space-8) auto' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>
        Git Analytics &amp; Evolution Visualizer
      </h1>
      <p>
        Load a local Git repository to explore its commit DAG, inspect file history timelines, and review codebase health metrics.
      </p>
    </div>
  );
};
