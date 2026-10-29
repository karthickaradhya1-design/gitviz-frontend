import React from 'react';
import { FolderGit2 } from 'lucide-react';
import './States.css';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`state-container ${className}`.trim()} role="status">
      <div className="state-icon-box state-icon-empty" aria-hidden="true">
        {icon || <FolderGit2 size={24} />}
      </div>
      <h3 className="state-title">{title}</h3>
      <p className="state-description">{description}</p>
      {action && <div className="state-actions">{action}</div>}
    </div>
  );
};
