const AppError = require('./AppError');
const httpStatus = require('../enums/http-status.enum');

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, httpStatus.UNAUTHORIZED);
  }
}

module.exports = UnauthorizedError;