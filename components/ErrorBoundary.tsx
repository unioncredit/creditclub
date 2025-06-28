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

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log errors after render phase is complete
    console.error('🔴 ErrorBoundary caught error:', error.message);
    console.error('🔴 Error stack:', error.stack);
    console.error('🔴 Component stack:', errorInfo.componentStack);
    
    // Store errorInfo for display
    this.setState({ errorInfo });
    
    // Additional debugging for React Error #310
    if (error.message?.includes('Objects are not valid as a React child')) {
      console.error('🔴 This is React Error #310 - attempting to render a non-primitive value');
      console.error('🔴 Check the component stack above to identify the problematic component');
      
      // Try to extract more info from the error
      const errorString = error.toString();
      
      // Look for object representations in the error
      const objectMatch = errorString.match(/object with keys \{([^}]+)\}/);
      if (objectMatch) {
        console.error('🔴 Attempted to render object with keys:', objectMatch[1]);
      }
      
      // Log any found numbers that might be NaN or Infinity
      if (errorString.includes('NaN')) {
        console.error('🔴 Error involves NaN value');
      }
      if (errorString.includes('Infinity')) {
        console.error('🔴 Error involves Infinity value');
      }
    }
  }

  override render() {
    if (this.state.hasError) {
      // Ensure we only render strings
      const errorMessage = this.state.error?.message || 'Unknown error';
      const errorStack = this.state.error?.stack || 'No stack trace available';
      const componentStack = this.state.errorInfo?.componentStack || 'No component stack available';
      
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
              {String(componentStack)}
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