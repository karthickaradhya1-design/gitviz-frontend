import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import './CtaBand.css';

export const CtaBand: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="cta-band-section"
      aria-labelledby="cta-heading"
    >
      <div className="home-page-container">
        <div
          className={`cta-band-card cta-band-animated ${
            isVisible ? 'cta-band-visible' : ''
          }`}
        >
          {/* Background Decorative Pattern & Glow */}
          <div className="cta-band-pattern" aria-hidden="true" />
          <div className="cta-band-glow" aria-hidden="true" />

          {/* Card Content */}
          <div className="cta-band-content">
            <h2 id="cta-heading" className="cta-band-title">
              Ready to look at your own history?
            </h2>

            <p className="cta-band-text">
              Load a local repository and explore its commit graph, file
              timelines and health metrics. Everything runs on your machine.
            </p>

            <div className="cta-band-actions">
              <Button
                variant="primary"
                size="lg"
                to="/graph"
                className="cta-btn-primary"
                trailingIcon={<ArrowRight size={18} />}
              >
                Open Commit Graph
              </Button>

              <Button
                variant="ghost"
                size="lg"
                to="/about"
                className="cta-btn-outline"
                leadingIcon={<BookOpen size={18} />}
              >
                Read About &amp; Limitations
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
