import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Landmark, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in BharatVirasat:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center p-8 rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Landmark className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">BharatVirasat Portal</h2>
            <p className="text-sm text-stone-400 mb-6">
              A temporary issue occurred while loading this view. Click below to reload.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.hash = '';
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Heritage Portal</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
