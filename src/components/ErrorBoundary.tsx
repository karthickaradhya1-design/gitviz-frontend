import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorState } from './states/ErrorState';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Component lifecycle catch handler for rendering errors
    if (import.meta.env.DEV) {
      // In dev mode, error details can be inspected
      void error;
      void errorInfo;
    }
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 'var(--space-8) var(--space-4)', maxWidth: '640px', margin: '0 auto' }}>
          <ErrorState
            title="An unexpected error occurred"
            description={
              this.state.error?.message ||
              'A rendering problem occurred while loading this view. You can reload the page to restore the application.'
            }
            onRetry={this.handleReload}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
