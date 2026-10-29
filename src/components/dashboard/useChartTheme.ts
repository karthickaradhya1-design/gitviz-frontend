import { useEffect, useState } from 'react';
import { useTheme } from '../ThemeProvider';

export interface ChartThemeColors {
  textSecondary: string;
  textPrimary: string;
  border: string;
  surface: string;
  accent: string;
  primary: string;
  laneColors: string[];
  isAnimationActive: boolean;
}

export function useChartTheme(): ChartThemeColors {
  const { theme } = useTheme();
  const [isAnimationActive, setIsAnimationActive] = useState(true);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsAnimationActive(!media.matches);

    const listener = (e: MediaQueryListEvent) => {
      setIsAnimationActive(!e.matches);
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  // Theme-aware colors derived from our tokens
  const isDark = theme === 'dark';

  return {
    textSecondary: isDark ? '#94A3B8' : '#52627A',
    textPrimary: isDark ? '#F1F5F9' : '#0B1F3A',
    border: isDark ? 'rgba(255, 255, 255, 0.12)' : '#DCE4EE',
    surface: isDark ? '#141E33' : '#FFFFFF',
    accent: '#00AEEF',
    primary: isDark ? '#38BDF8' : '#003366',
    laneColors: [
      '#1D70B8', // Lane 1: Cobalt
      '#E67E22', // Lane 2: Orange
      '#10B981', // Lane 3: Emerald
      '#9333EA', // Lane 4: Purple
      '#E11D48', // Lane 5: Crimson
      '#0284C7', // Lane 6: Sky Cyan
      '#D97706', // Lane 7: Amber
      '#6366F1', // Lane 8: Indigo
    ],
    isAnimationActive,
  };
}
