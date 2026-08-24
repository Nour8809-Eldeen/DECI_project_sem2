const AppError = require('../utils/AppError');

function notFound(req, res, next) {
  next(new AppError('Route not found', 404));
}

module.exports = notFound;
