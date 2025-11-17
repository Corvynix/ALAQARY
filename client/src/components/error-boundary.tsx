import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary caught an error:", error);
    console.error("Error Info:", errorInfo);
    
    this.setState({
      errorInfo: errorInfo.componentStack || null,
    });

    // Log to error reporting service in production
    if (import.meta.env.PROD) {
      // TODO: Send to error reporting service (e.g., Sentry, LogRocket)
      console.error("Production Error:", {
        error: error.toString(),
        errorInfo: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="max-w-2xl w-full border-destructive/50 shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-destructive" aria-hidden="true" />
              </div>
              <CardTitle className="text-3xl font-bold text-foreground">
                Oops! Something went wrong
                <br />
                <span className="text-2xl text-muted-foreground mt-2 block">
                  عذراً! حدث خطأ ما
                </span>
              </CardTitle>
              <CardDescription className="text-base">
                We encountered an unexpected error. This has been logged and we'll look into it.
                <br />
                <span className="block mt-1">
                  واجهنا خطأً غير متوقع. تم تسجيل هذا الخطأ وسننظر فيه.
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error Details (Development Only) */}
              {import.meta.env.DEV && this.state.error && (
                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <p className="text-sm font-mono text-destructive font-semibold mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs font-mono text-muted-foreground mt-2">
                      <summary className="cursor-pointer hover:text-foreground transition-colors">
                        Stack Trace (Click to expand)
                      </summary>
                      <pre className="mt-2 overflow-auto max-h-60 p-2 bg-background rounded">
                        {this.state.errorInfo}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={this.handleReset}
                  variant="default"
                  size="lg"
                  className="gap-2"
                  data-testid="button-error-retry"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Try Again / حاول مرة أخرى
                </Button>
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                  data-testid="button-error-reload"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Reload Page / أعد تحميل الصفحة
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                  data-testid="button-error-home"
                >
                  <Home className="h-4 w-4" aria-hidden="true" />
                  Go Home / الصفحة الرئيسية
                </Button>
              </div>

              {/* Support Info */}
              <div className="text-center pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  If this problem persists, please contact support
                  <br />
                  إذا استمرت هذه المشكلة، يرجى الاتصال بالدعم
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
