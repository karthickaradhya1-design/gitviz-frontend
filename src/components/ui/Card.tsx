import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import './Card.css';

interface BaseCardProps {
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
}

type CardAsDiv = BaseCardProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof BaseCardProps> & {
    to?: undefined;
  };

type CardAsLink = BaseCardProps &
  Omit<LinkProps, keyof BaseCardProps> & {
    to: string;
  };

export type CardProps = CardAsDiv | CardAsLink;

export const Card: React.FC<CardProps> = ({
  interactive = false,
  className = '',
  children,
  to,
  ...rest
}) => {
  const isInteractive = interactive || Boolean(to);
  const classes = `ui-card ${isInteractive ? 'ui-card-interactive' : ''} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...(rest as Omit<LinkProps, 'to'>)}>
        {children}
      </Link>
    );
  }

  return (
    <div className={classes} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>
      {children}
    </div>
  );
};
