// components/ui/ErrorBoundary.tsx
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import Button from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // In production, you'd send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Analytics.track('error_boundary_triggered', { error: error.message });
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-pink-900 to-orange-900">
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </div>
          
          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white p-6">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl text-center max-w-md">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
              <p className="text-white/90 mb-6">
                We're sorry, but something unexpected happened. Please try again.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-red-300 mb-2">Error Details</summary>
                  <pre className="text-xs text-red-200 bg-red-900/20 p-3 rounded overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              <div className="space-y-3">
                <Button onClick={this.handleReset} variant="primary">
                  Try Again
                </Button>
                <Button 
                  onClick={() => window.location.href = '/'}
                  variant="secondary"
                >
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
