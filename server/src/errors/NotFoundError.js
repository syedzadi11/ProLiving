const AppError = require('./AppError');
const httpStatus = require('../enums/http-status.enum');

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, httpStatus.NOT_FOUND);
  }
}

module.exports = NotFoundError;