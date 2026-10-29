import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  ChevronDown,
  Download,
  FileJson,
  FileSpreadsheet,
  GitCommit,
  RotateCcw,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { useChurn, useBusFactor } from '../api/hooks';
import { USE_MOCK, downloadExport } from '../api/client';
import { formatActivePeriod } from '../components/dashboard/metricsUtils';
import { StatCard } from '../components/dashboard/StatCard';
import { TopChurnChart } from '../components/dashboard/TopChurnChart';
import { BusFactorPanel } from '../components/dashboard/BusFactorPanel';
import { AuthorsChart } from '../components/dashboard/AuthorsChart';
import { ChurnTimeChart } from '../components/dashboard/ChurnTimeChart';
import { HonestyNotes } from '../components/dashboard/HonestyNotes';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/states';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const {
    data: churn,
    isLoading: isChurnLoading,
    error: churnError,
    refetch: refetchChurn,
  } = useChurn('default');

  const {
    data: busFactor,
    isLoading: isBusLoading,
    error: busError,
    refetch: refetchBus,
  } = useBusFactor('default');

  const [exportOpen, setExportOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleExport = (format: 'json' | 'csv') => {
    downloadExport({
      repoId: churn?.repo.name || 'default',
      format,
      churnData: churn,
      busFactorData: busFactor,
    });
    setExportOpen(false);
  };

  const isLoading = isChurnLoading || isBusLoading;
  const error = churnError || busError;

  const handleRetryAll = () => {
    refetchChurn();
    refetchBus();
  };

  return (
    <div className="dashboard-view">
      <div className="dashboard-container">
        {/* Page Header */}
        <div className="dashboard-header">
          <div className="dashboard-title-area">
            <div className="dashboard-heading-row">
              <h1 className="dashboard-title">Health Dashboard</h1>
              {USE_MOCK && (
                <Badge variant="info" className="sample-badge">
                  Sample data
                </Badge>
              )}
            </div>
            <p className="dashboard-subtitle">
              Churn, ownership and activity across the repository history.
            </p>
          </div>

          {/* Export Dropdown */}
          <div className="dashboard-export-wrapper" ref={dropdownRef}>
            <Button
              variant="secondary"
              size="md"
              leadingIcon={<Download size={15} />}
              trailingIcon={<ChevronDown size={14} />}
              onClick={() => setExportOpen(!exportOpen)}
              aria-haspopup="true"
              aria-expanded={exportOpen}
            >
              Export
            </Button>

            {exportOpen && (
              <div className="export-dropdown-menu" role="menu" aria-label="Export options">
                <button
                  type="button"
                  className="export-dropdown-item"
                  role="menuitem"
                  onClick={() => handleExport('json')}
                >
                  <FileJson size={15} className="export-item-icon" />
                  <div className="export-item-text">
                    <span className="export-item-label">Export JSON</span>
                    <span className="export-item-desc">Complete metrics payload</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="export-dropdown-item"
                  role="menuitem"
                  onClick={() => handleExport('csv')}
                >
                  <FileSpreadsheet size={15} className="export-item-icon" />
                  <div className="export-item-text">
                    <span className="export-item-label">Export CSV</span>
                    <span className="export-item-desc">Top churn files breakdown</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* State Handlers: Loading, Error, Empty */}
        {isLoading ? (
          <div className="dashboard-loading-layout">
            <div className="dashboard-stats-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="dashboard-skeleton-card">
                  <LoadingSkeleton rows={3} />
                </div>
              ))}
            </div>
            <div className="dashboard-row-two-col">
              <div className="dashboard-skeleton-card">
                <LoadingSkeleton rows={8} />
              </div>
              <div className="dashboard-skeleton-card">
                <LoadingSkeleton rows={8} />
              </div>
            </div>
          </div>
        ) : error ? (
          <ErrorState
            title="Could not load metrics"
            description="The API did not respond. Check that the backend is running, or switch USE_MOCK on in src/api/client.ts."
            onRetry={handleRetryAll}
          />
        ) : !churn || churn.repo.commit_count === 0 ? (
          <EmptyState
            title="No metrics yet"
            description="Load a repository and let the import finish to see its health metrics."
            action={
              <Button variant="primary" to="/" size="md" leadingIcon={<RotateCcw size={14} />}>
                Go to Home
              </Button>
            }
          />
        ) : (
          <div className="dashboard-content">
            {/* ROW 1: 4 Summary Stat Cards */}
            <section className="dashboard-stats-grid" aria-label="Repository summary metrics">
              <StatCard
                icon={<GitCommit size={18} />}
                label="Total Commits"
                value={churn.repo.commit_count.toLocaleString()}
                caption="Recorded in history"
              />
              <StatCard
                icon={<Users size={18} />}
                label="Authors"
                value={churn.repo.author_count}
                caption="Distinct contributors"
              />
              <StatCard
                icon={<Calendar size={18} />}
                label="Active Period"
                value={formatActivePeriod(churn.repo.first_commit_at, churn.repo.last_commit_at)}
                caption="First to last commit"
              />
              <StatCard
                icon={<ShieldAlert size={18} />}
                label="Bus Factor"
                value={busFactor ? busFactor.score : '—'}
                badge="estimate"
                caption="Concentration of commits"
              />
            </section>

            {/* ROW 2: Top-10 Churn (Left) + Bus Factor Panel (Right) */}
            <section className="dashboard-row-two-col" aria-label="Churn and Bus Factor metrics">
              <TopChurnChart
                files={churn.top_files}
                mergeCommitsCounted={churn.merge_commits_counted}
              />
              {busFactor && (
                <BusFactorPanel
                  busFactor={busFactor}
                  authorCount={churn.repo.author_count}
                />
              )}
            </section>

            {/* ROW 3: Commits per Author (Left) + Churn over Time (Right) */}
            <section className="dashboard-row-two-col" aria-label="Author and temporal metrics">
              <AuthorsChart authors={churn.commits_per_author} />
              <ChurnTimeChart
                data={churn.churn_over_time}
                mergeCommitsCounted={churn.merge_commits_counted}
              />
            </section>

            {/* ROW 4: Honest Notes */}
            <section className="dashboard-row-full" aria-label="Limitations and assumptions">
              <HonestyNotes
                mergeCommitsCounted={churn.merge_commits_counted}
                ignoredPatterns={churn.ignored_patterns}
              />
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
