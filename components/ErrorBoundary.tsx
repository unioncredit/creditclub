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
    // Enhanced logging for React Error #310
    if (error.message.includes('310') || error.message.includes('Objects are not valid as a React child')) {
      console.group('🔴 REACT ERROR #310 DETECTED');
      console.log('🕐 Timestamp:', new Date().toISOString());
      console.log('📝 Error Message:', error.message);
      console.log('📍 Error Stack:', error.stack);
      console.log('🧩 Component Stack:', errorInfo.componentStack);
      
      // Try to identify the problematic component
      const componentMatch = errorInfo.componentStack.match(/at (\w+)/g);
      if (componentMatch) {
        console.log('🎯 Component Chain:', componentMatch.slice(0, 5));
      }
      
      // Log current URL and any relevant state
      console.log('🌐 Current URL:', window.location.href);
      console.log('📊 User Agent:', navigator.userAgent);
      
      // Try to capture any React dev tools info if available
      if (typeof window !== 'undefined' && (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        console.log('⚛️ React DevTools available');
      }
      
      console.groupEnd();
      
      // Also send to external logging if needed
      if (typeof window !== 'undefined') {
        (window as any).__REACT_310_ERROR__ = {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          timestamp: new Date().toISOString()
        };
      }
    }

    console.error("Error caught by boundary:", error, errorInfo);
    // Store errorInfo for display
    this.setState({ errorInfo });
  }

  override render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      
      let errorMessage = "An unexpected error occurred";
      let errorStack = "";
      let componentStack = "";
      let isReact310 = false;
      
      if (error) {
        errorMessage = error.toString();
        errorStack = error.stack || "";
        
        // Check for React Error #310
        if (errorMessage.includes("Minified React error #310") || errorMessage.includes("Objects are not valid as a React child")) {
          isReact310 = true;
          errorMessage = "🔴 React Error #310: Objects are not valid as a React child.\n\nThis error occurs when trying to render an object, array, or other non-renderable value directly in JSX.";
          
          // Try to extract more context from the error
          const stackLines = errorStack.split('\n');
          const relevantLine = stackLines.find(line => 
            line.includes('components/') && 
            !line.includes('ErrorBoundary')
          );
          
          if (relevantLine) {
            errorMessage += `\n\n🎯 Likely source: ${relevantLine.trim()}`;
          }
          
          // Add troubleshooting info
          errorMessage += `\n\n🔍 Common causes:
- Contract hook returning complex objects instead of primitives
- Missing null checks in data extraction
- Async data not properly handled
- Array/object being rendered directly in JSX

💡 Check browser console for detailed logging.`;
        }
      }
      
      if (errorInfo && errorInfo.componentStack) {
        componentStack = errorInfo.componentStack;
      }
      
      return (
        <div style={{ padding: '20px', backgroundColor: '#fff', color: '#000', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ color: 'red', marginBottom: '20px' }}>
            {isReact310 ? '🔴 React Error #310 Detected' : 'Something went wrong.'}
          </h1>
          
          {isReact310 && (
            <div style={{ 
              backgroundColor: '#fff3cd', 
              border: '1px solid #ffeaa7', 
              padding: '15px', 
              borderRadius: '5px',
              marginBottom: '20px'
            }}>
              <strong>🚨 This is a React Error #310 - Objects as React children</strong>
              <p>Check the browser console for detailed logging that will help identify the exact component and data causing this issue.</p>
            </div>
          )}
          
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
            <summary style={{ cursor: 'pointer', marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>
              🔍 View Error Details
            </summary>
            <div style={{ fontFamily: 'monospace', fontSize: '12px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
              <strong>Error Message:</strong>
              <br />
              {String(errorMessage)}
              <br />
              <br />
              <strong>Component Stack:</strong>
              <br />
              {componentStack ? String(componentStack) : 'No component stack available'}
              <br />
              <br />
              <strong>Error Stack:</strong>
              <br />
              {String(errorStack)}
              <br />
              <br />
              <strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}
              <br />
              <strong>Timestamp:</strong> {new Date().toISOString()}
            </div>
          </details>
          
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                marginRight: '10px',
                padding: '10px 20px',
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              🔄 Reload Page
            </button>
            
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const errorData = (window as any).__REACT_310_ERROR__;
                  if (errorData) {
                    navigator.clipboard.writeText(JSON.stringify(errorData, null, 2));
                    alert('Error details copied to clipboard!');
                  }
                }
              }} 
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              📋 Copy Error Details
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 