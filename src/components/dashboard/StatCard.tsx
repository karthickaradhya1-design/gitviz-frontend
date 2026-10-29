import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import './StatCard.css';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  caption: string;
  badge?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  caption,
  badge,
  className = '',
}) => {
  return (
    <Card className={`stat-card ${className}`.trim()}>
      <div className="stat-card-header">
        <div className="stat-card-icon" aria-hidden="true">
          {icon}
        </div>
        <div className="stat-card-title-group">
          <span className="stat-card-label">{label}</span>
          {badge && (
            <Badge variant="warning" className="stat-card-badge">
              {badge}
            </Badge>
          )}
        </div>
      </div>

      <div className="stat-card-body">
        <span className="stat-card-value">{value}</span>
      </div>

      <div className="stat-card-footer">
        <span className="stat-card-caption">{caption}</span>
      </div>
    </Card>
  );
};
