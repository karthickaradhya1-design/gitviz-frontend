import { ThemeProvider } from './components/ThemeProvider';
import { DesignSystemPreview } from './components/DesignSystemPreview';

export function App() {
  return (
    <ThemeProvider>
      <main>
        <DesignSystemPreview />
      </main>
    </ThemeProvider>
  );
}

export default App;
