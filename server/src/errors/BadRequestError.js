const AppError = require('./AppError');
const httpStatus = require('../enums/http-status.enum');

class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, httpStatus.BAD_REQUEST);
  }
}

module.exports = BadRequestError;