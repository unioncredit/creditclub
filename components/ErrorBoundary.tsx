import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("=== ERROR BOUNDARY CAUGHT ERROR ===");
    console.error("Error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Component stack:", errorInfo.componentStack);
    console.error("Error info:", errorInfo);
    
    // Check specifically for React Error #310
    if (error.message.includes("310") || error.message.includes("Objects are not valid as a React child")) {
      console.error("=== REACT ERROR #310 DETECTED ===");
      console.error("This means an object is being rendered as a React child");
      console.error("Component stack trace:", errorInfo.componentStack);
      
      // Try to extract more details
      if (error.stack) {
        console.error("Full error stack:", error.stack);
      }
    }

    // Store error details in state
    this.setState({
      error,
      errorInfo,
    });

    // Send to error reporting service (if you have one)
    // Example: Sentry, LogRocket, etc.
    if (typeof window !== 'undefined') {
      // Log to browser console with full details
      console.group("🚨 React Error Boundary");
      console.error("Error:", error);
      console.error("Component Stack:", errorInfo.componentStack);
      console.error("Props that might have caused this:", this.props);
      console.groupEnd();

      // Store in localStorage for debugging
      try {
        localStorage.setItem('lastReactError', JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          url: window.location.href,
        }));
      } catch (e) {
        console.error("Failed to store error in localStorage:", e);
      }
    }
  }

  public override render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-8 border border-red-500 bg-red-50 rounded-lg m-4">
          <h2 className="text-red-800 text-xl font-bold mb-4">Something went wrong</h2>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-4">
              <summary className="cursor-pointer text-red-700 font-medium">
                Error Details (Development Only)
              </summary>
              <div className="mt-2 p-4 bg-red-100 rounded text-sm font-mono">
                <div className="mb-2">
                  <strong>Error:</strong> {this.state.error?.message}
                </div>
                {this.state.error?.stack && (
                  <div className="mb-2">
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap text-xs">
                      {this.state.error.stack}
                    </pre>
                  </div>
                )}
                {this.state.errorInfo?.componentStack && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="whitespace-pre-wrap text-xs">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
          
          <button 
            onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
          
          <button 
            onClick={() => window.location.reload()}
            className="ml-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 