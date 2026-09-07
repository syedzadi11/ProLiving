const AppError = require('./AppError');
const httpStatus = require('../enums/http-status.enum');

class ConflictError extends AppError {
  constructor(message = 'Conflict occurred') {
    super(message, httpStatus.CONFLICT);
  }
}

module.exports = ConflictError;