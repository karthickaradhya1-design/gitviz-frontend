import React from 'react';
import { Card } from '../ui/Card';
import { Info } from 'lucide-react';
import './ChartCard.css';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  infoTooltip?: string;
  actions?: React.ReactNode;
  ariaLabel: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  infoTooltip,
  actions,
  ariaLabel,
  children,
  className = '',
}) => {
  return (
    <Card className={`chart-card ${className}`.trim()}>
      <div className="chart-card-header">
        <div className="chart-card-title-area">
          <div className="chart-card-heading-row">
            <h3 className="chart-card-title">{title}</h3>
            {infoTooltip && (
              <span className="chart-card-info-icon" title={infoTooltip} tabIndex={0} aria-label={infoTooltip}>
                <Info size={14} />
              </span>
            )}
          </div>
          {subtitle && <p className="chart-card-subtitle">{subtitle}</p>}
        </div>

        {actions && <div className="chart-card-actions">{actions}</div>}
      </div>

      <div
        className="chart-card-content"
        role="region"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </Card>
  );
};
