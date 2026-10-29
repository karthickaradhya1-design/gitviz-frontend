import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Standardized page title and route-change focus management hook.
 * Sets document.title to `${pageName} | GitViz` and shifts focus to
 * the primary heading or main landmark without scroll jumping.
 */
export function usePageTitle(pageName: string): void {
  const location = useLocation();

  useEffect(() => {
    // 1. Update document title
    document.title = `${pageName} | GitViz`;

    // 2. Shift keyboard focus to the main content or primary heading
    const target =
      document.querySelector<HTMLElement>('main h1') ||
      document.getElementById('main-content');

    if (target) {
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
      target.focus({ preventScroll: true });
    }
  }, [pageName, location.pathname]);
}

export default usePageTitle;
