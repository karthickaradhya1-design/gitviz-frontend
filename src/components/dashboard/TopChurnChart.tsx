import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { BarChart3, ExternalLink, Flame, Table as TableIcon } from 'lucide-react';
import { TopFile } from '../../api/types';
import {
  truncateMiddle,
  getTopHotspotPaths,
  formatDate,
} from './metricsUtils';
import { useChartTheme } from './useChartTheme';
import { ChartCard } from './ChartCard';
import { Badge } from '../ui/Badge';
import './TopChurnChart.css';

interface TopChurnChartProps {
  files: TopFile[];
  mergeCommitsCounted: boolean;
}

type ChurnMetric = 'commits' | 'lines';

export const TopChurnChart: React.FC<TopChurnChartProps> = ({
  files,
  mergeCommitsCounted,
}) => {
  const navigate = useNavigate();
  const theme = useChartTheme();
  const [metric, setMetric] = useState<ChurnMetric>('commits');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  const top3Hotspots = useMemo(() => getTopHotspotPaths(files, 3), [files]);

  const mergeSentence = mergeCommitsCounted
    ? 'Merge commits are counted toward churn.'
    : 'Merge commits are NOT counted toward churn.';

  // Prepare data sorted by selected metric descending
  const chartData = useMemo(() => {
    const sorted = [...files].sort((a, b) => {
      return metric === 'commits'
        ? b.churn_commits - a.churn_commits
        : b.churn_lines - a.churn_lines;
    });

    return sorted.map((file) => ({
      ...file,
      truncatedPath: truncateMiddle(file.path, 22),
      val: metric === 'commits' ? file.churn_commits : file.churn_lines,
      isHotspot: top3Hotspots.has(file.path),
    }));
  }, [files, metric, top3Hotspots]);

  const handleRowClick = (path: string) => {
    navigate(`/files?path=${encodeURIComponent(path)}`);
  };

  const actions = (
    <div className="churn-card-actions">
      {/* Metric Selector Toggle */}
      <div className="segmented-control" role="group" aria-label="Metric selection">
        <button
          type="button"
          className={`segment-btn ${metric === 'commits' ? 'active' : ''}`}
          onClick={() => setMetric('commits')}
        >
          Commits
        </button>
        <button
          type="button"
          className={`segment-btn ${metric === 'lines' ? 'active' : ''}`}
          onClick={() => setMetric('lines')}
        >
          Lines changed
        </button>
      </div>

      {/* View Toggle */}
      <button
        type="button"
        className="churn-view-toggle-btn"
        onClick={() => setViewMode(viewMode === 'chart' ? 'table' : 'chart')}
        aria-label={viewMode === 'chart' ? 'View as table' : 'View as chart'}
        title={viewMode === 'chart' ? 'View as table' : 'View as chart'}
      >
        {viewMode === 'chart' ? <TableIcon size={14} /> : <BarChart3 size={14} />}
        <span>{viewMode === 'chart' ? 'Table' : 'Chart'}</span>
      </button>
    </div>
  );

  return (
    <ChartCard
      title="Top-10 Code Churn"
      subtitle={`Highest modified files by ${metric === 'commits' ? 'commit frequency' : 'net lines altered'}. Click any row to inspect evolution.`}
      infoTooltip={`${mergeSentence} Churn correlates with bug density but does not predict bugs directly.`}
      actions={actions}
      ariaLabel="Top-10 files with highest churn activity"
      className="top-churn-card"
    >
      {viewMode === 'chart' ? (
        <div className="churn-chart-container" role="img" aria-label="Horizontal bar chart of top files by churn">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 8, right: 30, left: 10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="churnBarGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#003366" />
                  <stop offset="100%" stopColor="#00AEEF" />
                </linearGradient>
                <linearGradient id="churnHotspotGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#F5A623" />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.border}
                horizontal={false}
              />

              <XAxis
                type="number"
                tick={{ fill: theme.textSecondary, fontSize: 11 }}
                stroke={theme.border}
              />

              <YAxis
                type="category"
                dataKey="truncatedPath"
                tick={{ fill: theme.textSecondary, fontSize: 11, fontFamily: 'var(--font-mono)' }}
                stroke={theme.border}
                width={130}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as typeof chartData[0];
                    return (
                      <div className="churn-tooltip">
                        <div className="churn-tooltip-path">{data.path}</div>
                        <div className="churn-tooltip-stat">
                          <span className="tooltip-label">
                            {metric === 'commits' ? 'Churn Commits:' : 'Lines Changed:'}
                          </span>
                          <strong className="tooltip-value">{data.val}</strong>
                        </div>
                        <div className="churn-tooltip-sub">
                          <span>All touches: {data.churn_commits} commits, {data.churn_lines} lines</span>
                        </div>
                        {data.isHotspot && (
                          <div className="churn-tooltip-hotspot">
                            <Flame size={12} /> Hotspot, inspect this
                          </div>
                        )}
                        <div className="churn-tooltip-notice">{mergeSentence}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Bar
                dataKey="val"
                radius={[0, 4, 4, 0]}
                isAnimationActive={theme.isAnimationActive}
                onClick={(entry) => handleRowClick(entry.path)}
                cursor="pointer"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.path}
                    fill={entry.isHotspot ? 'url(#churnHotspotGradient)' : 'url(#churnBarGradient)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="churn-table-wrapper" tabIndex={0} role="region" aria-label="Top churn files table">
          <table className="churn-table">
            <thead>
              <tr>
                <th scope="col">File Path</th>
                <th scope="col" className="text-right">Commits</th>
                <th scope="col" className="text-right">Lines</th>
                <th scope="col">Last Touched</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((file) => (
                <tr
                  key={file.path}
                  className="churn-table-row"
                  onClick={() => handleRowClick(file.path)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleRowClick(file.path);
                    }
                  }}
                  role="link"
                  aria-label={`View history for ${file.path}`}
                >
                  <td className="cell-path">
                    <span className="file-path-link" title={file.path}>
                      {file.path}
                      <ExternalLink size={12} className="link-icon" aria-hidden="true" />
                    </span>
                  </td>
                  <td className="cell-commits text-right">{file.churn_commits}</td>
                  <td className="cell-lines text-right">{file.churn_lines}</td>
                  <td className="cell-date">{formatDate(file.last_touch_at)}</td>
                  <td className="cell-status">
                    {file.isHotspot ? (
                      <Badge variant="warning" className="hotspot-badge">
                        Hotspot, inspect this
                      </Badge>
                    ) : (
                      <span className="status-normal">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ChartCard>
  );
};
