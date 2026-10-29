import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ChurnPoint } from '../../api/types';
import { useChartTheme } from './useChartTheme';
import { ChartCard } from './ChartCard';
import './ChurnTimeChart.css';

interface ChurnTimeChartProps {
  data: ChurnPoint[];
  mergeCommitsCounted: boolean;
}

type TimeMetric = 'commits' | 'lines';

export const ChurnTimeChart: React.FC<ChurnTimeChartProps> = ({
  data,
  mergeCommitsCounted,
}) => {
  const theme = useChartTheme();
  const [metric, setMetric] = useState<TimeMetric>('commits');

  const mergeSentence = mergeCommitsCounted
    ? 'Merge commits are counted toward churn.'
    : 'Merge commits are NOT counted toward churn.';

  // Format period for display ("2026-01" -> "Jan '26")
  const chartData = useMemo(() => {
    return data.map((point) => {
      let shortLabel = point.period;
      try {
        const [year, month] = point.period.split('-');
        if (year && month) {
          const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
          shortLabel = date.toLocaleDateString('en-US', { month: 'short' });
        }
      } catch {
        // fallback to period
      }

      return {
        ...point,
        shortLabel,
        value: metric === 'commits' ? point.commits : point.lines_changed,
      };
    });
  }, [data, metric]);

  const actions = (
    <div className="segmented-control" role="group" aria-label="Time metric selection">
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
  );

  return (
    <ChartCard
      title="Churn over Time"
      subtitle={`Monthly aggregate ${metric === 'commits' ? 'commits' : 'lines modified'} across repository history.`}
      infoTooltip={`${mergeSentence} Reflects historical cadence and periods of intense refactoring.`}
      actions={actions}
      ariaLabel="Area chart of churn volume over 12 months"
      className="churn-time-card"
    >
      <div className="churn-time-chart-area" role="img" aria-label="Area chart of repository activity over time">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 15, left: -10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="churnTimeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.accent} stopOpacity={0.35} />
                <stop offset="95%" stopColor={theme.accent} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.border}
              vertical={false}
            />

            <XAxis
              dataKey="shortLabel"
              stroke={theme.border}
              tick={{ fill: theme.textSecondary, fontSize: 11 }}
            />

            <YAxis
              stroke={theme.border}
              tick={{ fill: theme.textSecondary, fontSize: 11 }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as typeof chartData[0];
                  return (
                    <div className="time-tooltip">
                      <div className="time-tooltip-period">{item.period}</div>
                      <div className="time-tooltip-row">
                        <span>{metric === 'commits' ? 'Commits:' : 'Lines changed:'}</span>
                        <strong className="time-tooltip-val">
                          {item.value.toLocaleString()}
                        </strong>
                      </div>
                      <div className="time-tooltip-sub">
                        <span>Total: {item.commits} commits &middot; {item.lines_changed.toLocaleString()} lines</span>
                      </div>
                      <div className="time-tooltip-notice">{mergeSentence}</div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={theme.accent}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#churnTimeGradient)"
              isAnimationActive={theme.isAnimationActive}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
