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
    // Don't log in getDerivedStateFromError as it runs during render
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log errors after render phase is complete
    console.error('🔴 ErrorBoundary caught error:', error.message);
    console.error('🔴 Error stack:', error.stack);
    console.error('🔴 Component stack:', errorInfo.componentStack);
    
    // Additional debugging for React Error #310
    if (error.message?.includes('Objects are not valid as a React child')) {
      console.error('🔴 This is React Error #310 - attempting to render a non-primitive value');
      console.error('🔴 Check the component stack above to identify the problematic component');
    }
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