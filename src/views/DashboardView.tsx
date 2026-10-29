import React from 'react';

export const DashboardView: React.FC = () => {
  return (
    <div className="card" style={{ maxWidth: '800px', margin: 'var(--space-8) auto' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>
        Health Dashboard
      </h1>
      <p>
        Codebase metrics including top-10 churn hotspots, bus factor estimates, and author commit distributions.
      </p>
    </div>
  );
};
