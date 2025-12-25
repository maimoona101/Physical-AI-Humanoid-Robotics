/**
 * API Utilities
 * Validation and error handling utilities for API communication
 */

/**
 * Validates a query before sending to the backend
 * @param {string} query - The query string to validate
 * @returns {Object} - Validation result with is_valid flag and errors
 */
export const validateQuery = (query) => {
  const result = {
    is_valid: true,
    errors: [],
    sanitized_query: query?.trim() || ''
  };

  if (!query || query.trim().length === 0) {
    result.is_valid = false;
    result.errors.push('Query cannot be empty');
  } else if (query.trim().length < 3) {
    result.is_valid = false;
    result.errors.push('Query must be at least 3 characters long');
  } else if (query.length > 1000) {
    result.is_valid = false;
    result.errors.push('Query exceeds maximum length of 1000 characters');
  }

  // Sanitize the query
  result.sanitized_query = query.trim();

  return result;
};

/**
 * Validates query options before sending to the backend
 * @param {Object} options - Query options to validate
 * @returns {Object} - Validation result with is_valid flag and errors
 */
export const validateQueryOptions = (options = {}) => {
  const result = {
    is_valid: true,
    errors: []
  };

  // Validate max_tokens
  if (options.max_tokens !== undefined) {
    if (typeof options.max_tokens !== 'number' || options.max_tokens < 100 || options.max_tokens > 2000) {
      result.is_valid = false;
      result.errors.push('max_tokens must be a number between 100 and 2000');
    }
  }

  // Validate temperature
  if (options.temperature !== undefined) {
    if (typeof options.temperature !== 'number' || options.temperature < 0.0 || options.temperature > 1.0) {
      result.is_valid = false;
      result.errors.push('temperature must be a number between 0.0 and 1.0');
    }
  }

  // Validate top_p
  if (options.top_p !== undefined) {
    if (typeof options.top_p !== 'number' || options.top_p < 0.0 || options.top_p > 1.0) {
      result.is_valid = false;
      result.errors.push('top_p must be a number between 0.0 and 1.0');
    }
  }

  // Validate context
  if (options.context !== undefined && typeof options.context !== 'string') {
    result.is_valid = false;
    result.errors.push('context must be a string');
  } else if (options.context && options.context.length > 10000) {
    result.is_valid = false;
    result.errors.push('context exceeds maximum length of 10000 characters');
  }

  return result;
};

/**
 * Formats an API error for display to the user
 * @param {Error|Object|string} error - The error to format
 * @returns {string} - Formatted error message
 */
export const formatApiError = (error) => {
  if (!error) {
    return 'An unknown error occurred';
  }

  // Handle different error types
  if (typeof error === 'string') {
    return error;
  }

  // Handle fetch API errors
  if (error.message) {
    if (error.message.includes('Failed to fetch')) {
      return 'Unable to connect to the server. Please check that the backend is running.';
    }
    if (error.message.includes('NetworkError')) {
      return 'Network error. Please check your connection and try again.';
    }
    return error.message;
  }

  // Handle response errors
  if (error.status) {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please wait and try again.';
      case 500:
        return 'Server error. The backend encountered an issue. Please try again later.';
      case 502:
        return 'Server unavailable. Please check that the backend is running.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return `Server error (${error.status}). Please try again later.`;
    }
  }

  return 'An error occurred while processing your request';
};

/**
 * Checks if the API response indicates success
 * @param {Object} response - The API response object
 * @returns {boolean} - True if response indicates success
 */
export const isApiResponseSuccess = (response) => {
  return response && response.success !== false;
};

/**
 * Gets the appropriate timeout value based on environment
 * @returns {number} - Timeout value in milliseconds
 */
export const getApiTimeout = () => {
  return parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000; // Default 30 seconds
};

/**
 * Wrapper for fetch with timeout
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise} - Fetch promise with timeout
 */
export const fetchWithTimeout = async (url, options = {}, timeout = getApiTimeout()) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout: The request took too long to complete');
    }
    throw error;
  }
};