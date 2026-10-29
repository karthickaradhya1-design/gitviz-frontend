import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Compass, GitGraph, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import './NotFound.css';

export const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = 'Page not found | GitViz';
  }, []);

  return (
    <div className="not-found-view">
      <div className="not-found-container">
        {/* Decorative Inline SVG Commit Graph */}
        <div className="not-found-graphic" aria-hidden="true">
          <svg
            className="not-found-svg"
            viewBox="0 0 280 110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Main trunk line (Lane 1 - Cobalt Blue) */}
            <path
              d="M 30 35 L 250 35"
              stroke="var(--lane-1)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Branch curve (Lane 2 - Orange) */}
            <path
              d="M 80 35 C 105 35, 105 80, 130 80 L 175 80"
              stroke="var(--lane-2)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Severed / Missing branch with dashed line (Lane 5 - Crimson) */}
            <path
              d="M 175 80 L 225 80"
              stroke="var(--lane-5)"
              strokeWidth="3"
              strokeDasharray="4 4"
              strokeLinecap="round"
            />

            {/* Trunk Commit Nodes */}
            <circle cx="45" cy="35" r="7" fill="var(--color-bg)" stroke="var(--lane-1)" strokeWidth="3" />
            <circle cx="80" cy="35" r="7" fill="var(--color-bg)" stroke="var(--lane-1)" strokeWidth="3" />
            <circle cx="150" cy="35" r="7" fill="var(--color-bg)" stroke="var(--lane-1)" strokeWidth="3" />
            <circle cx="230" cy="35" r="7" fill="var(--color-bg)" stroke="var(--lane-1)" strokeWidth="3" />

            {/* Branch Commit Node */}
            <circle cx="140" cy="80" r="7" fill="var(--color-bg)" stroke="var(--lane-2)" strokeWidth="3" />

            {/* Missing Route Node (Question mark node) */}
            <circle cx="235" cy="80" r="14" fill="var(--color-bg)" stroke="var(--lane-5)" strokeWidth="2.5" />
            <text
              x="235"
              y="85"
              textAnchor="middle"
              fill="var(--lane-5)"
              fontSize="14"
              fontWeight="bold"
              fontFamily="var(--font-mono)"
            >
              ?
            </text>
          </svg>
        </div>

        {/* 404 Display */}
        <div className="not-found-number" aria-hidden="true">
          404
        </div>

        {/* Headings */}
        <h1 className="not-found-title">This page is not in the history</h1>
        <p className="not-found-description">
          The address may be mistyped, or the page may have moved.
        </p>

        {/* Requested Path Chip (Safe text rendering) */}
        <div className="not-found-chip-wrapper">
          <code className="not-found-chip">
            Requested: {location.pathname}
          </code>
        </div>

        {/* Action Buttons */}
        <div className="not-found-actions">
          <Button
            variant="primary"
            size="md"
            to="/"
            leadingIcon={<Home size={15} />}
          >
            Go to Home
          </Button>
          <Button
            variant="secondary"
            size="md"
            to="/graph"
            leadingIcon={<GitGraph size={15} />}
          >
            Open Commit Graph
          </Button>
        </div>

        {/* Ghost Link to Report Issue */}
        <div className="not-found-footer-link">
          <Link to="/about#team" className="not-found-ghost-link">
            <Compass size={13} aria-hidden="true" />
            <span>Report a problem</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
