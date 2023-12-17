/**
 * Custom error class for handling Express errors with status codes.
 * Extends the built-in JavaScript Error class.
 *
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 */
class ExpressError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;
