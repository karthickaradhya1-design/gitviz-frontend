import React from 'react';

export const FilesView: React.FC = () => {
  return (
    <div className="card" style={{ maxWidth: '800px', margin: 'var(--space-8) auto' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>
        File Evolution
      </h1>
      <p>
        Chronological evolution timeline and diff tracking for individual files, with visible indicators for history breaks on undetectable renames.
      </p>
    </div>
  );
};
