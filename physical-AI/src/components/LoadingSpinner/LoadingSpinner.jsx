import React from 'react';
import './LoadingSpinner.css';

/**
 * LoadingSpinner Component
 * Shows a loading indicator during query processing
 */
const LoadingSpinner = ({ message = 'Processing your query...', show = true }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <span className="loading-message">{message}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;