import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const AppShell: React.FC = () => {
  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main
        className="app-main"
        style={{
          flex: '1 0 auto',
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: 'var(--space-6) var(--space-6)',
        }}
      >
        <Outlet />
      </main>
      <footer className="app-footer"></footer>
    </div>
  );
};
