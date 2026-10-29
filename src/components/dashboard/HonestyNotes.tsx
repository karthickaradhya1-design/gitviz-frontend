import React from 'react';
import { Info } from 'lucide-react';
import { Card } from '../ui/Card';
import './HonestyNotes.css';

interface HonestyNotesProps {
  mergeCommitsCounted: boolean;
  ignoredPatterns: string[];
}

export const HonestyNotes: React.FC<HonestyNotesProps> = ({
  mergeCommitsCounted,
  ignoredPatterns,
}) => {
  return (
    <Card className="honesty-notes-card">
      <div className="honesty-notes-header">
        <Info size={18} className="honesty-notes-icon" aria-hidden="true" />
        <h4 className="honesty-notes-title">Metric Assumptions & Limitations</h4>
      </div>

      <ul className="honesty-notes-list">
        <li className="honesty-note-item">
          <strong>Merge Commits:</strong>{' '}
          {mergeCommitsCounted ? (
            <span>Merge commits are counted toward churn.</span>
          ) : (
            <span>Merge commits are NOT counted toward churn.</span>
          )}
        </li>

        <li className="honesty-note-item">
          <strong>Hotspots:</strong> Churn correlates with bugs but does not predict them.
          A hotspot means <em>inspect this</em>, never "this will break".
        </li>

        <li className="honesty-note-item ignored-patterns-item">
          <strong>Ignored by default:</strong>{' '}
          <span className="ignored-chips-container">
            {ignoredPatterns.map((pattern) => (
              <code key={pattern} className="ignored-pattern-chip">
                {pattern}
              </code>
            ))}
          </span>
          <span className="ignored-note">
            (Lockfiles and build output artifacts excluded from churn calculations)
          </span>
        </li>
      </ul>
    </Card>
  );
};
