import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const AppShell: React.FC = () => {
  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main className="app-main" style={{ flex: '1 0 auto', width: '100%' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
