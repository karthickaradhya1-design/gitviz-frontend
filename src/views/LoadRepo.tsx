import React, { useState } from 'react';
import { Database } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useCreateRepo } from '../api/hooks';
import { USE_MOCK } from '../api/client';
import { useRepo } from '../context/RepoContext';
import { Badge } from '../components/ui/Badge';
import { RepoPathForm } from '../components/load/RepoPathForm';
import { ImportProgress } from '../components/load/ImportProgress';
import { WhatHappensCard } from '../components/load/WhatHappensCard';
import { getRepoNameFromPath } from '../components/load/loadUtils';
import './LoadRepo.css';

export const LoadRepo: React.FC = () => {
  usePageTitle('Load Repository');

  const { repo, setRepo } = useRepo();
  const createRepoMutation = useCreateRepo();

  // Local state for active session path & error
  const [activePath, setActivePath] = useState(repo?.path || '');
  const [serverError, setServerError] = useState<Error | null>(null);

  // Determine if currently showing progress card
  const isCurrentlyImporting =
    (repo?.status === 'ingesting' && Boolean(repo.repoId)) ||
    createRepoMutation.isPending;

  const handleSubmitPath = async (submittedPath: string) => {
    setServerError(null);
    setActivePath(submittedPath);

    try {
      const res = await createRepoMutation.mutateAsync({ path: submittedPath });

      // Save initial ingestion state into RepoContext
      const repoName = getRepoNameFromPath(submittedPath);
      setRepo({
        repoId: res.repo_id,
        name: repoName,
        path: submittedPath,
        status: 'ingesting',
        commitCount: 0,
      });
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err
          : new Error('Failed to start repository ingestion')
      );
    }
  };

  const handleResetImport = (keepPath: boolean = true) => {
    createRepoMutation.reset();
    setServerError(null);
    if (!keepPath) {
      setActivePath('');
    }
    // Clear in-progress repo from context so form is displayed
    if (repo?.status === 'ingesting' || repo?.status === 'error') {
      setRepo(null);
    }
  };

  const activeRepoId = repo?.repoId || 'sample-repo';
  const displayPath = activePath || repo?.path || '';

  return (
    <div className="load-repo-view">
      <div className="load-repo-container">
        {/* Page Header */}
        <header className="load-repo-header">
          <div className="load-repo-title-row">
            <h1 className="load-repo-title">Load a Repository</h1>
            {USE_MOCK && (
              <Badge variant="info" icon={<Database size={12} />}>
                Sample data
              </Badge>
            )}
          </div>
          <p className="load-repo-subtitle">
            Enter the path of a local Git folder. GitViz reads its history once and shows
            progress while it imports.
          </p>
        </header>

        {/* Two-Column Responsive Layout */}
        <div className="load-repo-grid">
          {/* Left Column: Form OR Import Progress */}
          <section className="load-repo-main" aria-label="Repository input and status">
            {isCurrentlyImporting || repo?.status === 'done' || repo?.status === 'error' ? (
              <ImportProgress
                repoId={activeRepoId}
                repoPath={displayPath}
                onReset={handleResetImport}
              />
            ) : (
              <RepoPathForm
                onSubmit={handleSubmitPath}
                isSubmitting={createRepoMutation.isPending}
                serverError={serverError}
                onClearServerError={() => setServerError(null)}
                initialPath={activePath}
              />
            )}
          </section>

          {/* Right Column: What Happens Card */}
          <aside className="load-repo-aside" aria-label="Import information and guidelines">
            <WhatHappensCard />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default LoadRepo;
