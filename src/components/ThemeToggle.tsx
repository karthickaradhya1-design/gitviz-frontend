import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`btn btn-secondary ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        cursor: 'pointer',
      }}
    >
      {theme === 'light' ? (
        <>
          <Moon size={16} aria-hidden="true" style={{ color: 'var(--color-primary)' }} />
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <Sun size={16} aria-hidden="true" style={{ color: 'var(--color-accent)' }} />
          <span>Light Mode</span>
        </>
      )}
    </button>
  );
};
