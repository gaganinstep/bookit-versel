// middleware/errorHandler.js

const logger = require('../config/logger');
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  logger.error(
    `Error during request: ${req.method} ${req.url} - ${err.message}`
  );
  logger.error(err.stack);

  if (!res.headersSent) {
    const statusCode = err.statusCode ? err.statusCode : 500;
    res
      .status(statusCode)
      .json({ ...err, message: err.message || 'Internal Server Error' });
  } else {
    logger.warn('Headers already sent, cannot modify the response');
  }
}

module.exports = errorHandler;
