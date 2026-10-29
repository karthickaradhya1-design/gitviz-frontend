import React from 'react';

export const GraphView: React.FC = () => {
  return (
    <div className="card" style={{ maxWidth: '800px', margin: 'var(--space-8) auto' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>
        Commit Graph
      </h1>
      <p>
        Interactive DAG visualization of branches, merges, and commit topology with colorblind-friendly lanes.
      </p>
    </div>
  );
};
