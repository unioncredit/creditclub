import * as React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Don't log in getDerivedStateFromError as it runs during render
    return { hasError: true, error };
  }

  override componentDidCatch(_error: Error, errorInfo: React.ErrorInfo) {
    // Store errorInfo for display
    this.setState({ errorInfo });
  }

  override render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      
      let errorMessage = "An unexpected error occurred";
      let errorStack = "";
      let componentStack = "";
      
      if (error) {
        errorMessage = error.toString();
        errorStack = error.stack || "";
        
        // Check for React Error #310
        if (errorMessage.includes("Minified React error #310")) {
          errorMessage = "React Error #310: Objects are not valid as a React child. This error occurs when trying to render an object, array, or other non-renderable value directly in JSX.";
          
          // Try to extract more context from the error
          const stackLines = errorStack.split('\n');
          const relevantLine = stackLines.find(line => 
            line.includes('components/') && 
            !line.includes('ErrorBoundary')
          );
          
          if (relevantLine) {
            errorMessage += `\n\nLikely source: ${relevantLine.trim()}`;
          }
        }
      }
      
      if (errorInfo && errorInfo.componentStack) {
        componentStack = errorInfo.componentStack;
      }
      
      return (
        <div style={{ padding: '20px', backgroundColor: '#fff', color: '#000' }}>
          <h1 style={{ color: 'red' }}>Something went wrong.</h1>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
            <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
              Error details
            </summary>
            <div style={{ fontFamily: 'monospace', fontSize: '12px' }}>
              <strong>Error:</strong> {String(errorMessage)}
              <br />
              <br />
              <strong>Component Stack:</strong>
              <br />
              {componentStack ? String(componentStack) : ''}
              <br />
              <br />
              <strong>Error Stack:</strong>
              <br />
              {String(errorStack)}
            </div>
          </details>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 