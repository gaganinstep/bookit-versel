class CustomError extends Error {
  constructor(message, statusCode, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

module.exports = CustomError;
