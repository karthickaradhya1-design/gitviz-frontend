import React, { useState, useEffect, useRef } from 'react';
import { FolderGit2, AlertCircle, RotateCcw, X, Clock, Play } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  validateRepoPath,
  loadRecentRepos,
  clearRecentRepos,
  RecentRepo,
} from './loadUtils';
import './RepoPathForm.css';

interface RepoPathFormProps {
  onSubmit: (path: string) => void;
  isSubmitting: boolean;
  serverError: Error | null;
  onClearServerError: () => void;
  initialPath?: string;
}

export const RepoPathForm: React.FC<RepoPathFormProps> = ({
  onSubmit,
  isSubmitting,
  serverError,
  onClearServerError,
  initialPath = '',
}) => {
  const [path, setPath] = useState(initialPath);
  const [clientError, setClientError] = useState<string | null>(null);
  const [recentRepos, setRecentRepos] = useState<RecentRepo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRecentRepos(loadRecentRepos());
  }, []);

  useEffect(() => {
    if (initialPath) {
      setPath(initialPath);
    }
  }, [initialPath]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPath(val);
    if (clientError) setClientError(null);
    if (serverError) onClearServerError();
  };

  const handleClear = () => {
    setPath('');
    setClientError(null);
    if (serverError) onClearServerError();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationMessage = validateRepoPath(path);
    if (validationMessage) {
      setClientError(validationMessage);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    setClientError(null);
    onSubmit(path.trim());
  };

  const handleSelectRecent = (recentPath: string) => {
    setPath(recentPath);
    setClientError(null);
    if (serverError) onClearServerError();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClearRecent = () => {
    clearRecentRepos();
    setRecentRepos([]);
  };

  const hasError = Boolean(clientError || serverError);
  const errorDescriptionId = clientError
    ? 'repo-path-client-error'
    : serverError
    ? 'repo-path-server-error'
    : undefined;

  return (
    <Card className="repo-path-card">
      <div className="repo-path-header">
        <div className="repo-path-icon-wrap" aria-hidden="true">
          <FolderGit2 size={18} />
        </div>
        <div>
          <h2 className="repo-path-card-title">Repository Location</h2>
          <p className="repo-path-card-subtitle">
            Provide the local file path on the machine running GitViz.
          </p>
        </div>
      </div>

      {/* Backend API Error Alert */}
      {serverError && (
        <div
          id="repo-path-server-error"
          className="repo-path-server-alert"
          role="alert"
          aria-live="assertive"
        >
          <div className="server-alert-icon">
            <AlertCircle size={18} aria-hidden="true" />
          </div>
          <div className="server-alert-content">
            <h3 className="server-alert-title">Could not load repository</h3>
            <p className="server-alert-msg">{serverError.message}</p>
            <div className="server-alert-actions">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={onClearServerError}
                leadingIcon={<RotateCcw size={13} />}
              >
                Try again
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="repo-path-form" noValidate>
        <div className="form-group">
          <label htmlFor="repo-path-input" className="repo-path-label">
            Repository path
          </label>

          <div className="repo-path-input-wrap">
            <input
              ref={inputRef}
              id="repo-path-input"
              type="text"
              value={path}
              onChange={handleChange}
              placeholder="C:\Users\you\projects\my-repo or ~/projects/my-repo"
              autoComplete="off"
              spellCheck={false}
              disabled={isSubmitting}
              className={`repo-path-input ${hasError ? 'input-has-error' : ''}`}
              aria-invalid={hasError}
              aria-describedby={
                [errorDescriptionId, 'repo-path-helper'].filter(Boolean).join(' ') || undefined
              }
            />

            {path && !isSubmitting && (
              <button
                type="button"
                onClick={handleClear}
                className="input-clear-btn"
                aria-label="Clear path input"
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Client-side Inline Error */}
          {clientError && (
            <p id="repo-path-client-error" className="repo-path-client-error" role="alert">
              <AlertCircle size={13} aria-hidden="true" />
              <span>{clientError}</span>
            </p>
          )}

          {/* Helper Text */}
          <p id="repo-path-helper" className="repo-path-helper">
            This is the path on the machine where the GitViz backend runs. GitViz only reads the
            repository and never changes it.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="repo-path-actions">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            leadingIcon={
              isSubmitting ? (
                <span className="load-btn-spinner" aria-hidden="true" />
              ) : (
                <Play size={16} aria-hidden="true" />
              )
            }
          >
            {isSubmitting ? 'Starting import…' : 'Start import'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={handleClear}
            disabled={!path || isSubmitting}
          >
            Clear
          </Button>
        </div>
      </form>

      {/* Recent Repositories Chips */}
      {recentRepos.length > 0 && (
        <div className="recent-repos-section" aria-label="Recent repositories">
          <div className="recent-repos-header">
            <div className="recent-repos-title">
              <Clock size={13} aria-hidden="true" />
              <span>Recent repositories</span>
            </div>
            <button
              type="button"
              onClick={handleClearRecent}
              className="recent-clear-btn"
              aria-label="Clear recent repositories list"
            >
              Clear recent
            </button>
          </div>

          <div className="recent-chips-list" role="list">
            {recentRepos.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => handleSelectRecent(item.path)}
                disabled={isSubmitting}
                className="recent-chip"
                title={item.path}
                role="listitem"
              >
                <FolderGit2 size={12} className="recent-chip-icon" aria-hidden="true" />
                <span className="recent-chip-name">{item.name}</span>
                <span className="recent-chip-path">{item.path}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
