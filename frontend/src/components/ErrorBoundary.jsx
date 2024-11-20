// src/components/ErrorBoundary.jsx
import React from 'react';
import { toast } from 'react-hot-toast';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    toast.error('Došlo je do greške u aplikaciji');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Ups! Nešto je pošlo po krivu.</h2>
          <p>Molimo osvježite stranicu ili pokušajte ponovno kasnije.</p>
          <button 
            onClick={() => window.location.reload()}
            className="refresh-button"
          >
            Osvježi stranicu
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;