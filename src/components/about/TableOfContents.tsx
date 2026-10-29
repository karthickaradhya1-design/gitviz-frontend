import React, { useEffect, useState } from 'react';
import './TableOfContents.css';

export interface TocSection {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  sections: TocSection[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ sections }) => {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || '');

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible section with highest intersection ratio
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by intersection ratio or top position
          visibleEntries.sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio
          );
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleScrollTo = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      el.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });

      // Update URL hash without forcing abrupt browser jump
      window.history.pushState(null, '', `#${id}`);
      setActiveId(id);
    }
  };

  return (
    <nav className="about-toc" aria-label="Table of contents">
      <span className="toc-title">On this page</span>
      <ul className="toc-list">
        {sections.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <li key={id} className="toc-item">
              <a
                href={`#${id}`}
                className={`toc-link ${isActive ? 'is-active' : ''}`}
                onClick={(e) => handleScrollTo(id, e)}
                aria-current={isActive ? 'location' : undefined}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
