import React, { useState, useEffect } from 'react';
import './QueryHistory.css';

/**
 * QueryHistory Component
 * Displays the history of user queries
 */
const QueryHistory = () => {
  const [history, setHistory] = useState([]);

  // Load query history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('queryHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        // Only keep the last 10 queries
        setHistory(parsedHistory.slice(0, 10));
      } catch (error) {
        console.error('Error parsing query history:', error);
        setHistory([]);
      }
    }
  }, []);

  // Save query to history
  const saveToHistory = (query, response) => {
    const newEntry = {
      id: Date.now().toString(),
      query: query,
      response: response,
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [newEntry, ...history].slice(0, 10); // Keep only last 10
    setHistory(updatedHistory);
    localStorage.setItem('queryHistory', JSON.stringify(updatedHistory));
  };

  // Clear query history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('queryHistory');
  };

  // Add saveToHistory to window so it can be called from QueryInterface
  useEffect(() => {
    window.saveToQueryHistory = saveToHistory;
    return () => {
      delete window.saveToQueryHistory;
    };
  }, [history]);

  return (
    <div className="query-history">
      <div className="history-header">
        <h3>Query History</h3>
        {history.length > 0 && (
          <button className="clear-history-btn" onClick={clearHistory}>
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="no-history">No queries yet</p>
      ) : (
        <ul className="history-list">
          {history.map((entry) => (
            <li key={entry.id} className="history-item">
              <div className="history-query">
                <strong>Q:</strong> {entry.query}
              </div>
              <div className="history-response">
                <strong>A:</strong> {entry.response.answer || 'No response available'}
              </div>
              <div className="history-timestamp">
                {new Date(entry.timestamp).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QueryHistory;