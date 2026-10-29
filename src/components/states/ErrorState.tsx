import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import './States.css';

interface ErrorStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  icon,
  title,
  description,
  onRetry,
  className = '',
}) => {
  return (
    <div className={`state-container ${className}`.trim()} role="alert">
      <div className="state-icon-box state-icon-error" aria-hidden="true">
        {icon || <AlertCircle size={24} />}
      </div>
      <h3 className="state-title">{title}</h3>
      <p className="state-description">{description}</p>
      {onRetry && (
        <div className="state-actions">
          <Button
            variant="secondary"
            size="md"
            onClick={onRetry}
            leadingIcon={<RotateCcw size={15} />}
          >
            Try again
          </Button>
        </div>
      )}
    </div>
  );
};
