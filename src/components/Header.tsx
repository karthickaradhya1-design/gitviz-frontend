import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { GitBranch, Menu, X, CircleDot } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import './Header.css';

interface NavItem {
  label: string;
  path: string;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/', exact: true },
  { label: 'Commit Graph', path: '/graph' },
  { label: 'File Evolution', path: '/files' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'About', path: '/about' },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Update shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="header-container">
        {/* Left: Logo Mark */}
        <Link to="/" className="header-logo" aria-label="GitViz Homepage">
          <div className="header-logo-icon" aria-hidden="true">
            <GitBranch size={18} strokeWidth={2.4} />
          </div>
          <span className="header-logo-text">GitViz</span>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="header-nav" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `header-nav-link ${isActive ? 'active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Repository Status Chip & Actions */}
        <div className="header-actions">
          <div className="repo-status-chip" role="status" aria-live="polite">
            <CircleDot size={12} className="repo-status-dot" aria-hidden="true" />
            <span>No repo loaded</span>
          </div>

          <ThemeToggle variant="icon" />

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className="header-menu-toggle"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu Panel */}
      {isMobileMenuOpen && (
        <div id="mobile-navigation" className="mobile-nav-panel" role="region" aria-label="Mobile Navigation">
          <ul className="mobile-nav-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `mobile-nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMobileMenu}
                >
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mobile-panel-footer">
            <div className="repo-status-chip" role="status" style={{ display: 'inline-flex' }}>
              <CircleDot size={12} className="repo-status-dot" aria-hidden="true" />
              <span>No repo loaded</span>
            </div>
            <ThemeToggle variant="button" />
          </div>
        </div>
      )}
    </header>
  );
};
