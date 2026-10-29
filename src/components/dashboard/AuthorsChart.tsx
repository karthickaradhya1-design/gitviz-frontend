import React from 'react';
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
import { AuthorStat } from '../../api/types';
import { useChartTheme } from './useChartTheme';
import { ChartCard } from './ChartCard';
import './AuthorsChart.css';

interface AuthorsChartProps {
  authors: AuthorStat[];
}

export const AuthorsChart: React.FC<AuthorsChartProps> = ({ authors }) => {
  const theme = useChartTheme();

  // Sort authors by commit count descending
  const sortedAuthors = [...authors].sort((a, b) => b.commits - a.commits);

  // Shorten name for X axis (e.g. "Elena Rostova" -> "Elena R.")
  const chartData = sortedAuthors.map((author, index) => {
    const parts = author.name.split(' ');
    const shortName = parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : author.name;
    const initials = parts.map((p) => p[0]).join('').slice(0, 2).toUpperCase();
    const laneColor = theme.laneColors[index % theme.laneColors.length];

    return {
      ...author,
      shortName,
      initials,
      laneColor,
    };
  });

  return (
    <ChartCard
      title="Commits per Author"
      subtitle="Distribution of commits across identified contributors in repository history."
      ariaLabel="Bar chart of commits per contributor"
      className="authors-chart-card"
    >
      <div className="authors-content-layout">
        <div className="authors-chart-area" role="img" aria-label="Bar chart of author commit counts">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.border}
                vertical={false}
              />
              <XAxis
                dataKey="shortName"
                stroke={theme.border}
                tick={{ fill: theme.textSecondary, fontSize: 11 }}
                interval={0}
                angle={-20}
                textAnchor="end"
              />
              <YAxis
                stroke={theme.border}
                tick={{ fill: theme.textSecondary, fontSize: 11 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as typeof chartData[0];
                    return (
                      <div className="author-tooltip">
                        <div className="author-tooltip-name">{data.name}</div>
                        <div className="author-tooltip-stat">
                          <span>Commits:</span>
                          <strong>{data.commits}</strong>
                        </div>
                        <div className="author-tooltip-stat">
                          <span>Lines added:</span>
                          <strong className="stat-lines">+{data.lines_added.toLocaleString()}</strong>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="commits"
                radius={[4, 4, 0, 0]}
                isAnimationActive={theme.isAnimationActive}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.laneColor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / Contributor Summary List */}
        <div className="authors-legend-list">
          {chartData.map((author) => (
            <div key={author.name} className="author-legend-item">
              <div
                className="author-avatar"
                style={{ backgroundColor: author.laneColor }}
                title={author.name}
              >
                {author.initials}
              </div>
              <div className="author-legend-info">
                <span className="author-legend-name" title={author.name}>
                  {author.name}
                </span>
                <span className="author-legend-meta">
                  {author.commits} commits &middot; +{author.lines_added.toLocaleString()} lines
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
};
