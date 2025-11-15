import { Component, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-black via-[#0d0d0d] to-black flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              عذراً، حدث خطأ
            </h1>
            <p className="text-muted-foreground mb-8">
              نعتذر عن الإزعاج. يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-6 p-4 bg-destructive/5 border border-destructive/20 rounded-md text-left">
                <p className="text-xs font-mono text-destructive break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                variant="default"
                data-testid="button-error-reset"
              >
                العودة للرئيسية
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                data-testid="button-error-reload"
              >
                إعادة المحاولة
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
