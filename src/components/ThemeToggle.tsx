import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  className?: string;
  variant?: 'button' | 'icon';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'button',
  showLabel = true,
}) => {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === 'light' ? 'dark' : 'light';
  const labelText = `Switch to ${nextTheme} theme`;

  const isIconOnly = variant === 'icon' || !showLabel;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`btn btn-secondary ${className}`}
      aria-label={labelText}
      title={labelText}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isIconOnly ? 0 : 'var(--space-2)',
        width: isIconOnly ? '36px' : 'auto',
        height: isIconOnly ? '36px' : 'auto',
        padding: isIconOnly ? 'var(--space-2)' : 'var(--space-2) var(--space-4)',
        cursor: 'pointer',
      }}
    >
      {theme === 'light' ? (
        <>
          <Moon size={18} aria-hidden="true" style={{ color: 'var(--color-primary)' }} />
          {!isIconOnly && <span>Dark Mode</span>}
        </>
      ) : (
        <>
          <Sun size={18} aria-hidden="true" style={{ color: 'var(--color-accent)' }} />
          {!isIconOnly && <span>Light Mode</span>}
        </>
      )}
    </button>
  );
};
