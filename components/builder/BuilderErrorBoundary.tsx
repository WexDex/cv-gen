"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface BuilderErrorBoundaryProps {
  children: ReactNode;
  isDark?: boolean;
  title?: string;
  /** When this value changes, a stored render error is cleared so children render again. */
  resetKey?: string;
}

interface State {
  error: Error | null;
}

export class BuilderErrorBoundary extends Component<BuilderErrorBoundaryProps, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Builder render error:", error.message, info.componentStack);
  }

  componentDidUpdate(prevProps: BuilderErrorBoundaryProps) {
    const key = this.props.resetKey;
    if (key !== undefined && key !== prevProps.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    const { children, isDark = false, title = "This panel hit a render error" } = this.props;
    if (this.state.error) {
      return (
        <div
          className={cn(
            "flex h-full min-h-48 flex-col gap-2 p-4 text-sm",
            isDark ? "bg-zinc-950 text-zinc-200" : "bg-red-50 text-red-900",
          )}
        >
          <p className="font-semibold">{title}</p>
          <p className={cn("text-xs opacity-90", isDark ? "text-zinc-400" : "text-red-800")}>
            Switch project in the toolbar, fix JSON in the Data editor, or change the form. This message clears when you
            open another resume or the data becomes valid again.
          </p>
          <pre
            className={cn(
              "mt-1 max-h-40 overflow-auto rounded border p-2 text-[11px] leading-snug whitespace-pre-wrap",
              isDark ? "border-zinc-700 bg-zinc-900 text-red-300" : "border-red-200 bg-white",
            )}
          >
            {this.state.error.message}
          </pre>
        </div>
      );
    }
    return children;
  }
}
