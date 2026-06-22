import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-container">
            <div className="error-boundary-icon">!</div>
            <h1 className="error-boundary-title">Something went wrong</h1>
            <p className="error-boundary-text">
              An unexpected error occurred. Please try again or return to the home page.
            </p>
            <button className="error-boundary-btn" onClick={this.handleReset}>
              Back to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
