const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/ErrorResponse');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const message = errors
    .array()
    .map((error) => error.msg)
    .join(', ');

  return next(new ErrorResponse(message, 400));
};

module.exports = validateRequest;
