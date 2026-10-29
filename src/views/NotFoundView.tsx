import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundView: React.FC = () => {
  return (
    <div className="card" style={{ maxWidth: '800px', margin: 'var(--space-8) auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>
        404 — Page Not Found
      </h1>
      <p style={{ marginBottom: 'var(--space-4)' }}>
        The requested route does not exist. Use the navigation links above to return to GitViz.
      </p>
      <div>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};
