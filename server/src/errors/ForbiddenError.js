const AppError = require('./AppError');
const httpStatus = require('../enums/http-status.enum');

class ForbiddenError extends AppError {
  constructor(message = 'You are not allowed to perform this action') {
    super(message, httpStatus.FORBIDDEN);
  }
}

module.exports = ForbiddenError;