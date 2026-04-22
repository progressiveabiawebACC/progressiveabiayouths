import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
          <div className="relative mb-8">
            <div className="absolute -inset-4 rounded-full bg-destructive/10 blur-xl" />
            <AlertTriangle className="relative h-20 w-20 text-destructive" />
          </div>
          
          <h1 className="mb-2 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Something went wrong
          </h1>
          
          <p className="mb-8 max-w-md text-lg font-medium text-muted-foreground">
            We've encountered an unexpected error. Don't worry, our team has been notified.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button 
              size="lg" 
              onClick={this.handleReset}
              className="gap-2 font-bold"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={this.handleGoHome}
              className="gap-2 font-bold"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </div>

          {process.env.NODE_MODEL !== "production" && this.state.error && (
            <div className="mt-12 max-w-2xl overflow-hidden rounded-xl border bg-muted/50 p-6 text-left">
              <p className="mb-2 font-mono text-sm font-bold text-destructive">
                Error details:
              </p>
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-muted-foreground">
                {this.state.error.stack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.children;
  }
}

export default ErrorBoundary;
