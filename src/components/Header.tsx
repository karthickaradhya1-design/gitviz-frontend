import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { GitBranch, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useRepo } from '../context/RepoContext';
import { useRepoStatus } from '../api/hooks';
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

  const { repo } = useRepo();
  const { data: liveStatus } = useRepoStatus(
    repo?.repoId,
    repo?.status === 'ingesting'
  );

  let chipText = 'No repo loaded';
  let dotClass = 'dot-neutral';

  if (repo) {
    if (repo.status === 'ingesting') {
      const pct = liveStatus?.pct ?? 0;
      chipText = `Importing ${repo.name} ${pct}%`;
      dotClass = 'dot-ingesting';
    } else if (repo.status === 'done') {
      chipText = repo.name;
      dotClass = 'dot-success';
    } else if (repo.status === 'error') {
      chipText = 'Import failed';
      dotClass = 'dot-error';
    }
  }

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
          <Link
            to="/load"
            className="repo-status-chip-link"
            aria-label={`Repository status: ${chipText}. Open the load page.`}
          >
            <div className="repo-status-chip" role="status" aria-live="polite">
              <span className={`repo-status-dot ${dotClass}`} aria-hidden="true" />
              <span>{chipText}</span>
            </div>
          </Link>

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
            <li>
              <NavLink
                to="/load"
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? 'active' : ''}`
                }
                onClick={closeMobileMenu}
              >
                <span>Load repository</span>
              </NavLink>
            </li>
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
            <Link
              to="/load"
              className="repo-status-chip-link"
              aria-label={`Repository status: ${chipText}. Open the load page.`}
              onClick={closeMobileMenu}
            >
              <div className="repo-status-chip" role="status" style={{ display: 'inline-flex' }}>
                <span className={`repo-status-dot ${dotClass}`} aria-hidden="true" />
                <span>{chipText}</span>
              </div>
            </Link>
            <ThemeToggle variant="button" />
          </div>
        </div>
      )}
    </header>
  );
};
