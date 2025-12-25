import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';
import { validateQuery } from '../../utils/apiUtils';
import { sendQuery } from '../../services/api.js';
import './QueryInterface.css';

/**
 * QueryInterface Component
 * Main component for entering queries and displaying responses
 */
const QueryInterface = () => {
  const [query, setQuery] = useState('');
  const [context, setContext] = useState('');
  const [maxTokens, setMaxTokens] = useState(500);
  const [temperature, setTemperature] = useState(0.7);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [queryValidation, setQueryValidation] = useState({ is_valid: true, errors: [] });

  // Real-time validation of the query
  useEffect(() => {
    const validation = validateQuery(query);
    setQueryValidation(validation);
  }, [query]);

  // Function to handle loading state properly
  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  // Function to handle error state properly
  const showError = (message) => setError(message);
  const clearError = () => setError(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use validation utility
    const validation = validateQuery(query);
    if (!validation.is_valid) {
      showError(validation.errors.join(', '));
      return;
    }

    startLoading();
    clearError();

    try {
      // Prepare options for the query
      const options = {
        context: context || null,
        max_tokens: maxTokens,
        temperature: temperature
      };

      const result = await sendQuery(validation.sanitized_query, options);
      setResponse(result);

      // Save to query history if the function is available
      if (window.saveToQueryHistory) {
        window.saveToQueryHistory(query, result);
      }
    } catch (err) {
      showError(err.message || 'An error occurred while processing your query');
      setResponse(null);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="query-interface">
      <h2>Ask a Question</h2>
      <form onSubmit={handleSubmit} className="query-form">
        <div className="query-input-container">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your question here..."
            className={`query-input ${!queryValidation.is_valid ? 'invalid' : ''}`}
            rows="4"
            disabled={isLoading}
          />
          {!queryValidation.is_valid && queryValidation.errors.length > 0 && (
            <div className="validation-error">
              {queryValidation.errors.join(', ')}
            </div>
          )}
        </div>

        <div className="query-options">
          <div className="option-group">
            <label htmlFor="context">Context (optional):</label>
            <textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Provide additional context for the query..."
              className="context-input"
              rows="2"
              disabled={isLoading}
            />
          </div>

          <div className="option-group">
            <label htmlFor="maxTokens">Max Tokens:</label>
            <input
              type="number"
              id="maxTokens"
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              min="100"
              max="2000"
              className="option-input"
              disabled={isLoading}
            />
          </div>

          <div className="option-group">
            <label htmlFor="temperature">Temperature:</label>
            <input
              type="number"
              id="temperature"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              min="0"
              max="1"
              step="0.1"
              className="option-input"
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          className="query-submit-button"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? 'Processing...' : 'Submit Query'}
        </button>
      </form>

      {isLoading && <LoadingSpinner />}

      {error && <ErrorMessage message={error} />}

      {response && !isLoading && (
        <div className="response-container">
          <h3>Response</h3>
          <div className="response-content">
            <div className="response-query">
              <h4>Query:</h4>
              <p>{response.query}</p>
            </div>
            <div className="response-answer">
              <h4>Answer:</h4>
              <div className="answer-content">
                {response.answer}
              </div>
            </div>
            {response.sources && response.sources.length > 0 && (
              <div className="sources-section">
                <h4>Sources:</h4>
                <ul>
                  {response.sources.map((source, index) => (
                    <li key={index}>{source}</li>
                  ))}
                </ul>
              </div>
            )}
            {response.context_used && response.context_used.length > 0 && (
              <div className="context-section">
                <h4>Context Used:</h4>
                <ul>
                  {response.context_used.map((context, index) => (
                    <li key={index}>{context}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="response-metadata">
              <p><em>Response time: {response.response_time ? response.response_time.toFixed(2) : 'N/A'} seconds</em></p>
              {response.timestamp && (
                <p><em>Generated at: {new Date(response.timestamp).toLocaleString()}</em></p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryInterface;