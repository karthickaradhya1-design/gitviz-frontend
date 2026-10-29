import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'lg';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> & {
    to?: undefined;
  };

type ButtonAsLink = BaseButtonProps &
  Omit<LinkProps, keyof BaseButtonProps> & {
    to: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  leadingIcon,
  trailingIcon,
  className = '',
  children,
  to,
  ...rest
}) => {
  const classes = `btn btn-${variant} btn-${size} ${className}`.trim();

  const content = (
    <>
      {leadingIcon && <span className="btn-icon-leading" aria-hidden="true">{leadingIcon}</span>}
      <span>{children}</span>
      {trailingIcon && <span className="btn-icon-trailing" aria-hidden="true">{trailingIcon}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...(rest as Omit<LinkProps, 'to'>)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
};
