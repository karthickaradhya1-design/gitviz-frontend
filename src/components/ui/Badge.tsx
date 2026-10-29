import React from 'react';
import './Badge.css';

export type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface BadgeProps {
  variant?: BadgeVariant;
  dot?: boolean;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  dot = false,
  icon,
  className = '',
  children,
}) => {
  return (
    <span className={`ui-badge ui-badge-${variant} ${className}`.trim()}>
      {dot && <span className="ui-badge-dot" aria-hidden="true" />}
      {icon && <span className="ui-badge-icon" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
