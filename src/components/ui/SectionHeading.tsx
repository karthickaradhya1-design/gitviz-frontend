import React from 'react';
import './SectionHeading.css';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
  id?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
  id,
}) => {
  return (
    <div className={`section-heading section-heading-${align} ${className}`.trim()}>
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      <h2 id={id} className="section-title">
        {title}
      </h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
};
