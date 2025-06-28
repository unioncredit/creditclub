import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('🔴 ErrorBoundary caught error:', error);
    console.error('🔴 Error stack:', error.stack);
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🔴 ErrorBoundary componentDidCatch:', {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
    });
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h1>Something went wrong.</h1>
                  <details style={{ whiteSpace: 'pre-wrap' }}>
          <summary>Error details</summary>
          {this.state.error && this.state.error.message ? this.state.error.message : 'Unknown error'}
          <br />
          {this.state.error && this.state.error.stack ? this.state.error.stack : 'No stack trace'}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
} 