import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileSearch, Layers } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useFiles, useFileHistory } from '../api/hooks';
import { useRepo } from '../context/RepoContext';
import { Button } from '../components/ui/Button';
import { FilePicker } from '../components/files/FilePicker';
import { FileTimeline } from '../components/files/FileTimeline';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/states';
import { SectionHeading } from '../components/ui/SectionHeading';
import './FileEvolution.css';

export const FileEvolution: React.FC = () => {
  usePageTitle('File Evolution');
  const { activeRepoId } = useRepo();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlPath = searchParams.get('path');
  const [mobilePickerOpen, setMobilePickerOpen] = useState(false);

  // 1. Fetch file list
  const {
    data: files,
    isLoading: isFilesLoading,
    error: filesError,
    refetch: refetchFiles,
  } = useFiles(activeRepoId || undefined);

  // Determine current active file path
  const currentPath = useMemo(() => {
    if (urlPath) return urlPath;
    if (files && files.length > 0) {
      // Default to router.ts if available, else first file
      const preferred = files.find((f) => f.path === 'src/core/router.ts');
      return preferred ? preferred.path : files[0].path;
    }
    return null;
  }, [urlPath, files]);

  // Sync URL when default path is determined
  useEffect(() => {
    if (!urlPath && currentPath) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('path', currentPath);
          return next;
        },
        { replace: true }
      );
    }
  }, [urlPath, currentPath, setSearchParams]);

  // 2. Fetch history for active file
  const {
    data: history,
    isLoading: isHistoryLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useFileHistory(activeRepoId || undefined, currentPath);

  const handleSelectPath = (path: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('path', path);
      return next;
    });
    setMobilePickerOpen(false);
  };

  return (
    <div className="file-evolution-view">
      <div className="file-evolution-container">
        {/* Header Heading */}
        <div className="file-evolution-header">
          <SectionHeading
            as="h1"
            eyebrow="File Evolution"
            title="Inspect how any file changed over time"
            subtitle="Explore unified diffs, rename history, and chronological commits. Lineage breaks are surfaced honestly when Git's rename heuristics lose track."
            align="left"
          />

          {/* Mobile file picker drawer toggle button */}
          <div className="mobile-picker-toggle-bar">
            <button
              type="button"
              className="mobile-picker-toggle-btn"
              onClick={() => setMobilePickerOpen(!mobilePickerOpen)}
              aria-expanded={mobilePickerOpen}
            >
              <FileSearch size={15} />
              <span>
                {currentPath ? `File: ${currentPath.split('/').pop()}` : 'Select file'}
              </span>
              <span className="mobile-picker-toggle-badge">
                {files ? `${files.length} files` : 'Files'}
              </span>
            </button>
          </div>
        </div>

        {/* Main Content: Empty State when no repo loaded, or two-column layout */}
        {!activeRepoId ? (
          <EmptyState
            title="No repository loaded"
            description="Load a repository to inspect its file evolution and diffs."
            action={
              <Button to="/load" variant="primary" size="md">
                Load a repository
              </Button>
            }
          />
        ) : (
          <div className="file-evolution-layout">
            {/* Left Column: File Picker */}
            <aside
              className={`file-evolution-sidebar ${
                mobilePickerOpen ? 'is-mobile-open' : ''
              }`}
            >
              {isFilesLoading ? (
                <div className="sidebar-loading">
                  <LoadingSkeleton rows={10} />
                </div>
              ) : filesError ? (
                <ErrorState
                  title="Failed to load files"
                  description={filesError.message}
                  onRetry={refetchFiles}
                />
              ) : !files || files.length === 0 ? (
                <EmptyState
                  icon={<Layers size={24} />}
                  title="No files found"
                  description="This repository does not have any tracked files in history."
                  action={
                    <Button to="/load" variant="primary" size="md">
                      Load a repository
                    </Button>
                  }
                />
              ) : (
                <FilePicker
                  files={files}
                  selectedPath={currentPath}
                  onSelectPath={handleSelectPath}
                />
              )}
            </aside>

            {/* Right Column: File Timeline & Diff View */}
            <main className="file-evolution-main">
              {isHistoryLoading ? (
                <div className="main-loading">
                  <LoadingSkeleton rows={8} />
                </div>
              ) : historyError ? (
                <ErrorState
                  title="Failed to load file history"
                  description={historyError.message}
                  onRetry={refetchHistory}
                />
              ) : !history ? (
                <EmptyState
                  icon={<FileSearch size={24} />}
                  title="Select a file"
                  description="Pick a repository file from the sidebar to inspect its commit lineage and diffs."
                />
              ) : (
                <FileTimeline history={history} />
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileEvolution;
