import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ThemeProvider';
import { Header } from './components/Header';
import { NotFound } from './views/NotFound';
import { Home } from './views/Home';
import { About } from './views/About';

function renderWithProviders(ui: React.ReactElement, initialRoute: string = '/') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MemoryRouter initialEntries={[initialRoute]}>
          {ui}
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

describe('Application Smoke Tests', () => {
  beforeEach(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  });

  it('Header displays all five navigation destinations', () => {
    renderWithProviders(<Header />);

    // In desktop navigation
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(nav).toBeDefined();

    expect(screen.getByRole('link', { name: /^home$/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /^commit graph$/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /^file evolution$/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /^dashboard$/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /^about$/i })).toBeDefined();
  });

  it('ThemeToggle flips data-theme attribute on <html> element', async () => {
    renderWithProviders(<Header />);

    const themeToggleButtons = screen.getAllByRole('button', { name: /switch to dark theme|switch to light theme/i });
    const button = themeToggleButtons[0];
    expect(button).toBeDefined();

    const initialTheme = document.documentElement.getAttribute('data-theme');
    fireEvent.click(button);

    await waitFor(() => {
      const nextTheme = document.documentElement.getAttribute('data-theme');
      expect(nextTheme).not.toBe(initialTheme);
    });
  });

  it('NotFound page shows the requested path text safely', () => {
    const testPath = '/non-existent-repository-route';
    renderWithProviders(<NotFound />, testPath);

    expect(screen.getByText('This page is not in the history')).toBeDefined();
    expect(screen.getByText(new RegExp(`Requested:\\s*${testPath}`))).toBeDefined();
    expect(screen.getByRole('link', { name: /go to home/i })).toBeDefined();
  });

  it('Home page renders without crashing', () => {
    const { container } = renderWithProviders(<Home />);
    expect(container.querySelector('h1')).toBeDefined();
    expect(screen.getByText(/See your repository's/i)).toBeDefined();
  });

  it('About page renders without crashing', () => {
    const { container } = renderWithProviders(<About />);
    expect(container.querySelector('h1')).toBeDefined();
    expect(screen.getByRole('heading', { name: /About & Limitations/i })).toBeDefined();
    expect(screen.getByRole('heading', { name: /Known Limitations/i })).toBeDefined();
  });
});
