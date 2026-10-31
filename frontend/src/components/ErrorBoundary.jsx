import React from 'react';
import ErrorPage from '../pages/ErrorPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Tampilkan halaman error 500 dengan pesan kustom
      return (
        <ErrorPage 
          code={500} 
          customMessage="Aplikasi mengalami kendala teknis. Silakan muat ulang halaman atau hubungi administrator." 
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;