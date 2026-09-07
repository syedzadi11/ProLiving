
const httpStatus = require('../enums/http-status.enum');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || httpStatus.INTERNAL_ERROR;
  const message = err.message || 'Something went wrong';

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;