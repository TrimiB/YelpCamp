/**
 * Wraps a route handler function to catch any errors and pass them to Express error handling middleware.
 *
 * @param {function} fnc - The route handler function to wrap.
 * @returns {function} A wrapped route handler that catches errors.
 */
module.exports = (fnc) => {
  return (req, res, next) => {
    fnc(req, res, next).catch(next);
  };
};
