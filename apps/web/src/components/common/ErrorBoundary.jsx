import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '500px',
            width: '100%',
            background: '#fff',
            borderRadius: '8px',
            padding: '30px',
            border: '1px solid #ddd'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              margin: '0 auto 20px',
              background: '#ffebee',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: '#d32f2f'
            }}>
              !
            </div>

            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '10px'
            }}>
              Something went wrong
            </h2>
            <p style={{
              color: '#666',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details style={{
                marginBottom: '20px',
                padding: '15px',
                background: '#f5f5f5',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                <summary style={{
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  marginBottom: '10px'
                }}>
                  Error Details (Development Only)
                </summary>
                <div style={{
                  marginTop: '10px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  overflowX: 'auto'
                }}>
                  <p style={{ fontWeight: '600', marginBottom: '5px' }}>Error:</p>
                  <p style={{ marginBottom: '15px', color: '#d32f2f' }}>{this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <>
                      <p style={{ fontWeight: '600', marginBottom: '5px' }}>Stack Trace:</p>
                      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={this.handleReset}
                style={{
                  flex: 1,
                  background: '#0066cc',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  flex: 1,
                  background: '#f0f0f0',
                  color: '#333',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
