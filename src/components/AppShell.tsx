import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const AppShell: React.FC = () => {
  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <a href="#main-content" className="skip-to-content-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="app-main" style={{ flex: '1 0 auto', width: '100%' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppShell;
