import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ThemeProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppShell } from './components/AppShell';
import { LoadingSkeleton } from './components/states';

// Eagerly loaded critical views
import { Home } from './views/Home';
import { NotFoundView } from './views/NotFoundView';

// Route-level code-split lazy views
const GraphView = lazy(() => import('./views/GraphView'));
const FilesView = lazy(() => import('./views/FilesView'));
const DashboardView = lazy(() => import('./views/DashboardView'));
const AboutView = lazy(() => import('./views/AboutView'));
const DesignSystemView = lazy(() => import('./views/DesignSystemView'));

export function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
          },
        },
      })
  );

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <Suspense
              fallback={
                <div style={{ maxWidth: '1200px', margin: 'var(--space-8) auto', padding: '0 var(--space-4)' }}>
                  <LoadingSkeleton rows={8} />
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<AppShell />}>
                  <Route index element={<Home />} />
                  <Route path="graph" element={<GraphView />} />
                  <Route path="files" element={<FilesView />} />
                  <Route path="dashboard" element={<DashboardView />} />
                  <Route path="about" element={<AboutView />} />
                  <Route path="design-system" element={<DesignSystemView />} />
                  <Route path="*" element={<NotFoundView />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
