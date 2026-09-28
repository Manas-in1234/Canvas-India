import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
  stack: string;
  componentStack: string;
}

const CRASH_LOG_KEY = 'canvas_india_last_crash';

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '', stack: '', componentStack: '' };

  static getDerivedStateFromError(error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    return { hasError: true, message: err.message, stack: err.stack || '' };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('Unhandled error caught by ErrorBoundary:', error, info);
    this.setState({ componentStack: info.componentStack || '' });

    try {
      localStorage.setItem(
        CRASH_LOG_KEY,
        JSON.stringify({
          message: err.message,
          stack: err.stack || '',
          componentStack: info.componentStack || '',
          url: window.location.href,
          userAgent: navigator.userAgent,
          time: new Date().toISOString()
        })
      );
    } catch {}
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  handleCopyDetails = () => {
    const details = `${this.state.message}\n\n${this.state.stack}\n\nComponent stack:${this.state.componentStack}\n\nURL: ${window.location.href}`;
    navigator.clipboard?.writeText(details).catch(() => {});
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 px-6 text-center">
          <div className="max-w-lg">
            <h1 className="text-2xl font-semibold text-stone-800 mb-2">Something went wrong</h1>
            <p className="text-stone-600 mb-6">
              We hit an unexpected error while loading this page. Your work may not have been saved.
            </p>
            <div className="flex items-center justify-center gap-3 mb-6">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleCopyDetails}
                className="px-5 py-2.5 rounded-lg border border-stone-300 text-stone-700 font-medium hover:bg-stone-100 transition-colors"
              >
                Copy Error Details
              </button>
            </div>
            {this.state.message && (
              <pre className="text-left text-xs text-stone-500 bg-stone-100 rounded-lg p-3 overflow-auto max-h-48 whitespace-pre-wrap break-words">
                {this.state.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
