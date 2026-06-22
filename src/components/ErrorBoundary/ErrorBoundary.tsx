import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import i18n from '../../i18n';
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
            <h1 className="error-boundary-title">{i18n.t('errorBoundary.title')}</h1>
            <p className="error-boundary-text">{i18n.t('errorBoundary.text')}</p>
            <button className="error-boundary-btn" onClick={this.handleReset}>
              {i18n.t('errorBoundary.backToHome')}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
