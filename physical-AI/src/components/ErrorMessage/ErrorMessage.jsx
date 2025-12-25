import React from 'react';
import './ErrorMessage.css';

/**
 * ErrorMessage Component
 * Displays error messages when queries fail
 */
const ErrorMessage = ({ message, show = true, onDismiss = null }) => {
  if (!show || !message) {
    return null;
  }

  return (
    <div className="error-message-container">
      <div className="error-message">
        <div className="error-header">
          <span className="error-icon">⚠️</span>
          <span className="error-title">Error</span>
          {onDismiss && (
            <button className="error-dismiss" onClick={onDismiss} aria-label="Dismiss error">
              ×
            </button>
          )}
        </div>
        <div className="error-content">
          {message}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;