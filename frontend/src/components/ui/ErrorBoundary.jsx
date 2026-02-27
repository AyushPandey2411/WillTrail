import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="card p-8 max-w-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-crimson/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-crimson" />
            </div>
            <h2 className="font-display text-xl font-semibold text-white mb-2">Something went wrong</h2>
            <p className="text-navy-400 text-sm mb-6">An unexpected error occurred in this section.</p>
            <button onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-primary w-full">Try Again</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
