import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  GitBranch,
  FileClock,
  Activity,
  Circle,
  Loader2,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useRepoStatus } from '../../api/hooks';
import { useRepo } from '../../context/RepoContext';
import { getStepItems, getRepoNameFromPath, addRecentRepo, loadRecentRepos, saveRecentRepos } from './loadUtils';
import './ImportProgress.css';

interface ImportProgressProps {
  repoId: string;
  repoPath: string;
  onReset: (keepPath?: boolean) => void;
}

export const ImportProgress: React.FC<ImportProgressProps> = ({
  repoId,
  repoPath,
  onReset,
}) => {
  const navigate = useNavigate();
  const { setRepo } = useRepo();

  // Poll status while not terminal
  const { data: status, error: queryError } = useRepoStatus(repoId, true);

  const pct = status ? Math.max(0, Math.min(100, status.pct)) : 0;
  const commitCount = status?.commit_count ?? 0;
  const isDone = status?.status === 'done' || pct >= 100;
  const isError = status?.status === 'error' || Boolean(queryError);
  const errorMessage = status?.error || queryError?.message || 'Failed to complete repository import';

  // Live region milestone announcer (only at 25, 50, 75, 100%)
  const [announcement, setAnnouncement] = useState('');
  const lastAnnouncedMilestoneRef = useRef<number>(0);

  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    for (const m of milestones) {
      if (pct >= m && lastAnnouncedMilestoneRef.current < m) {
        lastAnnouncedMilestoneRef.current = m;
        if (m === 100) {
          setAnnouncement(`Import finished: ${commitCount.toLocaleString()} commits indexed.`);
        } else {
          setAnnouncement(`Import progress: ${m}% complete.`);
        }
        break;
      }
    }
  }, [pct, commitCount]);

  // When import completes, persist in RepoContext and recent repositories list
  const hasSavedContextRef = useRef(false);
  useEffect(() => {
    if (isDone && !hasSavedContextRef.current) {
      hasSavedContextRef.current = true;
      const repoName = getRepoNameFromPath(repoPath);

      setRepo({
        repoId,
        name: repoName,
        path: repoPath,
        status: 'done',
        commitCount,
      });

      // Update recent repositories list
      const recents = loadRecentRepos();
      const updated = addRecentRepo(recents, { path: repoPath, name: repoName });
      saveRecentRepos(updated);
    }
  }, [isDone, repoId, repoPath, commitCount, setRepo]);

  const stepItems = getStepItems(pct);
  const repoName = getRepoNameFromPath(repoPath);

  return (
    <Card className="import-progress-card">
      {/* Screen reader live region for milestones */}
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>

      {/* Header */}
      <div className="import-progress-header">
        <div>
          <span className="import-target-label">Importing repository</span>
          <h2 className="import-target-name">{repoName}</h2>
          <code className="import-target-path" title={repoPath}>
            {repoPath}
          </code>
        </div>

        {isDone ? (
          <div className="status-indicator done">
            <CheckCircle2 size={20} aria-hidden="true" />
            <span>Complete</span>
          </div>
        ) : isError ? (
          <div className="status-indicator error">
            <AlertTriangle size={20} aria-hidden="true" />
            <span>Failed</span>
          </div>
        ) : (
          <div className="status-indicator ingesting">
            <Loader2 size={18} className="spinner-icon" aria-hidden="true" />
            <span>Ingesting</span>
          </div>
        )}
      </div>

      {/* Progress Bar & Stats (Shown while in progress or completed) */}
      {!isError && (
        <div className="import-bar-section">
          <div className="import-bar-labels">
            <span className="import-pct-text">{pct}%</span>
            <span className="import-commits-count">
              {commitCount > 0
                ? `${commitCount.toLocaleString()} commits read so far`
                : 'Reading git history…'}
            </span>
          </div>

          <div
            className="import-progressbar-track"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Repository import progress"
          >
            <div
              className={`import-progressbar-fill ${isDone ? 'is-done' : ''}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* 4-Step Milestone Checklist */}
      {!isError && (
        <div className="import-steps-list" role="list" aria-label="Import milestones">
          {stepItems.map((step) => {
            const isStepCompleted = step.status === 'completed';
            const isStepActive = step.status === 'active';

            return (
              <div
                key={step.id}
                role="listitem"
                className={`import-step-item status-${step.status}`}
              >
                <div className="step-icon-wrap" aria-hidden="true">
                  {isStepCompleted ? (
                    <CheckCircle2 size={16} className="step-check" />
                  ) : isStepActive ? (
                    <div className="step-active-dot" />
                  ) : (
                    <Circle size={14} className="step-pending-circle" />
                  )}
                </div>
                <span className="step-label">{step.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Success Completion State */}
      {isDone && (
        <div className="import-success-block" role="status">
          <div className="success-banner">
            <CheckCircle2 size={24} className="success-icon" aria-hidden="true" />
            <div>
              <h3 className="success-title">Import finished</h3>
              <p className="success-desc">
                {commitCount.toLocaleString()} commits indexed. Ready to explore repository history.
              </p>
            </div>
          </div>

          <div className="success-nav-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/graph')}
              leadingIcon={<GitBranch size={16} />}
            >
              Open Commit Graph
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/files')}
              leadingIcon={<FileClock size={16} />}
            >
              File Evolution
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/dashboard')}
              leadingIcon={<Activity size={16} />}
            >
              Health Dashboard
            </Button>
          </div>
        </div>
      )}

      {/* Error Failure State */}
      {isError && (
        <div className="import-error-block" role="alert">
          <div className="error-banner">
            <AlertTriangle size={24} className="error-icon" aria-hidden="true" />
            <div>
              <h3 className="error-title">Import encountered an error</h3>
              <p className="error-desc">{errorMessage}</p>
              <p className="error-safe-note">Your repository was not changed.</p>
            </div>
          </div>

          <div className="error-nav-actions">
            <Button
              variant="primary"
              size="md"
              onClick={() => onReset(true)}
              leadingIcon={<RotateCcw size={14} />}
            >
              Try again
            </Button>

            <Button
              variant="ghost"
              size="md"
              onClick={() => onReset(false)}
            >
              Choose different path
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
