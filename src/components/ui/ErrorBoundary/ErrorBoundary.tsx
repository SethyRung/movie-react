import { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

// Enhanced error tracking interface
interface ErrorReport {
  id: string;
  timestamp: string;
  error: {
    message: string;
    name: string;
    stack?: string;
  };
  componentStack: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId: string;
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo, errorReport: ErrorReport) => void;
  maxRetries?: number;
  showErrorDetails?: boolean;
  enableErrorReporting?: boolean;
  reportingEndpoint?: string;
  fallbackComponent?: React.ComponentType<{ error: Error; retry: () => void; reset: () => void }>;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  errorId?: string;
  isReporting: boolean;
  reportFailed: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  private retryTimeouts: NodeJS.Timeout[] = [];
  private sessionId: string;

  public static defaultProps: Partial<Props> = {
    maxRetries: 3,
    showErrorDetails: false,
    enableErrorReporting: import.meta.env.PROD,
    fallbackComponent: undefined,
  };

  constructor(props: Props) {
    super(props);
    this.sessionId = this.generateSessionId();
    this.state = {
      hasError: false,
      retryCount: 0,
      isReporting: false,
      reportFailed: false,
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);

    const newState = {
      error,
      errorInfo,
      isReporting: false,
      reportFailed: false,
    };

    this.setState(newState);

    // Create error report
    const errorReport = this.createErrorReport(error, errorInfo);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo, errorReport);

    // Send error report if enabled
    if (this.props.enableErrorReporting) {
      this.reportError(errorReport);
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private createErrorReport = (error: Error, errorInfo: ErrorInfo): ErrorReport => ({
    id: this.state.errorId || 'unknown',
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      name: error.name,
      stack: error.stack,
    },
    componentStack: errorInfo.componentStack || '',
    userAgent: navigator.userAgent,
    url: window.location.href,
    sessionId: this.sessionId,
  });

  private reportError = async (errorReport: ErrorReport) => {
    if (!this.props.enableErrorReporting || !this.props.reportingEndpoint) {
      return;
    }

    this.setState({ isReporting: true, reportFailed: false });

    try {
      const response = await fetch(this.props.reportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      });

      if (!response.ok) {
        throw new Error(`Failed to report error: ${response.statusText}`);
      }

      console.log('Error reported successfully:', errorReport.id);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
      this.setState({ reportFailed: true });
    } finally {
      this.setState({ isReporting: false });
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: 0,
      errorId: undefined,
      isReporting: false,
      reportFailed: false,
    });

    // Clear any pending retry timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
    this.retryTimeouts = [];
  };

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      const timeout = setTimeout(() => {
        this.setState(prevState => ({
          retryCount: prevState.retryCount + 1,
        }));
        this.handleReset();
      }, delay);

      this.retryTimeouts.push(timeout);
    }
  };

  private copyErrorDetails = () => {
    const { error, errorInfo, errorId } = this.state;
    if (!error || !errorInfo) return;

    const errorText = `
Error ID: ${errorId}
Timestamp: ${new Date().toISOString()}
Message: ${error.message}
Name: ${error.name}
Stack: ${error.stack}
Component Stack: ${errorInfo.componentStack}
User Agent: ${navigator.userAgent}
URL: ${window.location.href}
Session ID: ${this.sessionId}
    `.trim();

    navigator.clipboard.writeText(errorText).then(() => {
      // Show success message (could use a toast notification)
      console.log('Error details copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy error details:', err);
    });
  };

  private getErrorCategory = (error: Error): string => {
    if (error.name === 'ChunkLoadError') return 'Code Splitting Error';
    if (error.message.includes('Network')) return 'Network Error';
    if (error.message.includes('Permission')) return 'Permission Error';
    if (error.message.includes('TypeError')) return 'Type Error';
    if (error.message.includes('ReferenceError')) return 'Reference Error';
    return 'Application Error';
  };

  public componentWillUnmount() {
    // Clean up timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  public render() {
    const { hasError, error, errorInfo, retryCount, isReporting, reportFailed } = this.state;
    const {
      fallback,
      fallbackComponent: FallbackComponent,
      showErrorDetails,
      maxRetries = 3
    } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Use custom fallback component if provided
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={error}
            retry={this.handleRetry}
            reset={this.handleReset}
          />
        );
      }

      const errorCategory = this.getErrorCategory(error);
      const canRetry = retryCount < maxRetries;

      // Default enhanced error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-lg w-full">
            <Alert className="mb-6">
              <AlertDescription className="text-center">
                {/* Warning Icon */}
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-destructive"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>

                {/* Error Title */}
                <h1 className="text-2xl font-semibold text-foreground mb-2">
                  Something went wrong
                </h1>

                {/* Error Category */}
                <div className="mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                    {errorCategory}
                  </span>
                </div>

                {/* Error Message */}
                <p className="text-muted-foreground mb-4">
                  {error.message || 'An unexpected error occurred'}
                </p>

                {/* Retry Info */}
                {retryCount > 0 && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Retry attempt {retryCount} of {maxRetries}
                    {!canRetry && ' - Maximum retries reached'}
                  </p>
                )}

                {/* Error Reporting Status */}
                {this.props.enableErrorReporting && (
                  <div className="mb-4">
                    {isReporting && (
                      <div className="flex items-center justify-center text-sm text-muted-foreground">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Reporting error...
                      </div>
                    )}
                    {reportFailed && (
                      <div className="flex items-center justify-center text-sm text-destructive">
                        Failed to report error
                      </div>
                    )}
                  </div>
                )}

                {/* Error Details (Development or explicit enable) */}
                {(showErrorDetails || import.meta.env.DEV) && errorInfo && (
                  <details className="mb-6 text-left">
                    <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground mb-2">
                      Error Details (Development)
                    </summary>
                    <div className="mt-2 space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Error Stack:</h4>
                        <pre className="p-3 bg-muted rounded text-xs overflow-auto max-h-32 whitespace-pre-wrap">
                          {error.stack}
                        </pre>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Component Stack:</h4>
                        <pre className="p-3 bg-muted rounded text-xs overflow-auto max-h-32 whitespace-pre-wrap">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Session Info:</h4>
                        <div className="text-xs text-muted-foreground">
                          <p>Session ID: {this.sessionId}</p>
                          <p>Error ID: {this.state.errorId}</p>
                        </div>
                      </div>
                    </div>
                  </details>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {canRetry && (
                    <Button onClick={this.handleRetry} variant="outline" disabled={isReporting}>
                      {retryCount === 0 ? 'Try Again' : `Retry (${retryCount}/${maxRetries})`}
                    </Button>
                  )}
                  <Button onClick={this.handleReset} disabled={isReporting}>
                    Reset Component
                  </Button>
                  <Button onClick={this.handleReload} variant="secondary" disabled={isReporting}>
                    Reload Page
                  </Button>
                </div>

                {/* Additional Actions */}
                {(showErrorDetails || import.meta.env.DEV) && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button
                      onClick={this.copyErrorDetails}
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                    >
                      Copy Error Details
                    </Button>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
export type { Props as ErrorBoundaryProps, State as ErrorBoundaryState, ErrorReport };