import React from 'react';

export const AboutView: React.FC = () => {
  return (
    <div className="card" style={{ maxWidth: '800px', margin: 'var(--space-8) auto' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>
        About &amp; Known Limitations
      </h1>
      <p>
        GitViz combines local Git repository parsing with metrics analysis, acknowledging known limitations such as browser DOM bounds and rename detection boundaries.
      </p>
    </div>
  );
};
