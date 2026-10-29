import React from 'react';
import { Link } from 'react-router-dom';
import {
  GitBranch,
  ExternalLink,
  Users,
  AlertTriangle,
  Cpu,
  ArrowUp,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { USE_MOCK } from '../api/client';
import './Footer.css';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-container">
        {/* 4-Column Layout */}
        <div className="footer-grid">
          {/* Column 1: Brand */}
          <div className="footer-col footer-brand">
            <Link to="/" className="footer-logo" aria-label="GitViz Homepage">
              <div className="footer-logo-icon" aria-hidden="true">
                <GitBranch size={18} strokeWidth={2.4} />
              </div>
              <span className="footer-logo-text">GitViz</span>
            </Link>

            <p className="footer-brand-desc">
              A free, open-source Git analytics and evolution visualizer.
              Runs locally and reads your repository without changing it.
            </p>
          </div>

          {/* Column 2: Explore Navigation */}
          <div className="footer-col">
            <h4 className="footer-heading">Explore</h4>
            <nav aria-label="Explore navigation">
              <ul className="footer-nav-list">
                <li>
                  <Link to="/" className="footer-link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/load" className="footer-link">
                    Load Repository
                  </Link>
                </li>
                <li>
                  <Link to="/graph" className="footer-link">
                    Commit Graph
                  </Link>
                </li>
                <li>
                  <Link to="/files" className="footer-link">
                    File Evolution
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="footer-link">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Column 3: Project Navigation */}
          <div className="footer-col">
            <h4 className="footer-heading">Project</h4>
            <nav aria-label="Project navigation">
              <ul className="footer-nav-list">
                <li>
                  <Link to="/about" className="footer-link">
                    About &amp; Limitations
                  </Link>
                </li>
                <li>
                  <Link to="/design-system" className="footer-link">
                    Design System
                  </Link>
                </li>
                <li>
                  {/* TODO: replace with official GitHub repository URL when published */}
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                    title="External link to GitHub repository"
                  >
                    <span>GitHub repository</span>
                    <ExternalLink size={13} aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Column 4: Honest by Design */}
          <div className="footer-col">
            <h4 className="footer-heading">Honest by design</h4>
            <ul className="footer-notes-list">
              <li className="footer-note-item">
                <Users size={15} className="footer-note-icon" aria-hidden="true" />
                <span>Bus factor is an estimate</span>
              </li>
              <li className="footer-note-item">
                <AlertTriangle size={15} className="footer-note-icon" aria-hidden="true" />
                <span>Churn means inspect this, not this will break</span>
              </li>
              <li className="footer-note-item">
                <Cpu size={15} className="footer-note-icon" aria-hidden="true" />
                <span>Numbers computed from Git, not guessed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright-group">
            <p className="footer-copyright">
              &copy; 2026 GitViz. Built as a college project.
            </p>
            {USE_MOCK && (
              <span className="footer-mock-indicator" title="Application is currently reading mock JSON data">
                Mock data
              </span>
            )}
          </div>

          <div className="footer-bottom-actions">
            <ThemeToggle variant="icon" />

            <button
              type="button"
              onClick={scrollToTop}
              className="back-to-top-btn"
              aria-label="Back to top of page"
              title="Back to top"
            >
              <ArrowUp size={14} aria-hidden="true" />
              <span>Back to top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
