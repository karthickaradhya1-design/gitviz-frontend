import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ThemeProvider';
import { AppShell } from './components/AppShell';

import { Home } from './views/Home';
import { GraphView } from './views/GraphView';
import { FilesView } from './views/FilesView';
import { DashboardView } from './views/DashboardView';
import { AboutView } from './views/AboutView';
import { NotFoundView } from './views/NotFoundView';
import { DesignSystemView } from './views/DesignSystemView';

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
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
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
