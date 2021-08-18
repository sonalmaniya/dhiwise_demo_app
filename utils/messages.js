const responseStatusCode = require('./responseCode');

exports.successResponse = (data, res) => res.status(responseStatusCode.success).json({
  STATUS: 'SUCCESS',
  MESSAGE: 'Your request is successfully executed',
  DATA: data,
});

exports.failureResponse = (data, res) => res.status(responseStatusCode.internalServerError).json({
  STATUS: 'FAILURE',
  MESSAGE: 'Internal Server Error',
  DATA: data,
});

exports.badRequest = (data, res) => res.status(responseStatusCode.badRequest).json({
  STATUS: 'BAD_REQUEST',
  MESSAGE: 'The request cannot be fulfilled due to bad syntax',
  DATA: data,
});

exports.validationError = (data, res) => res.status(responseStatusCode.validationError).json({
  STATUS: 'VALIDATION_ERROR',
  MESSAGE: 'Invalid Data, Validation Failed',
  DATA: data,
});

exports.isDuplicate = (data, res) => res.status(responseStatusCode.validationError).json({
  STATUS: 'VALIDATION_ERROR',
  MESSAGE: 'Data Duplication Found',
  DATA: data,
});

exports.recordNotFound = (data, res) => res.status(responseStatusCode.success).json({
  STATUS: 'RECORD_NOT_FOUND',
  MESSAGE: 'Record not found with specified criteria.',
  DATA: data,
});

exports.insufficientParameters = (res) => res.status(responseStatusCode.badRequest).json({
  STATUS: 'BAD_REQUEST',
  MESSAGE: 'Insufficient parameters',
  DATA: {},
});

exports.mongoError = (err, res) => res.status(responseStatusCode.internalServerError).json({
  STATUS: 'FAILURE',
  MESSAGE: 'Mongo db related error',
  DATA: err,
});

exports.inValidParam = (err, res) => res.status(responseStatusCode.validationError).json({
  STATUS: 'VALIDATION_ERROR',
  MESSAGE: 'Invalid values in parameters',
  DATA: err,
});

exports.unAuthorizedRequest = (err, res) => res.status(responseStatusCode.unAuthorizedRequest).json({
  STATUS: 'UNAUTHORIZED',
  MESSAGE: 'You are not authorized to access the request',
  ERROR: err,
});

exports.loginSuccess = (data, res) => res.status(responseStatusCode.success).json({
  STATUS: 'SUCCESS',
  MESSAGE: 'Login Successful',
  DATA: data,
});

exports.passwordEmailWrong = (res) => res.status(responseStatusCode.badRequest).json({
  STATUS: 'BAD_REQUEST',
  MESSAGE: 'username or password is wrong',
  DATA: {},
});
exports.loginFailed = (data, res) => res.status(responseStatusCode.badRequest).json({
  STATUS: 'BAD_REQUEST',
  MESSAGE: 'Login Failed',
  DATA: data,
});
exports.failedSoftDelete = (res) => res.status(responseStatusCode.internalServerError).json({
  STATUS: 'FAILURE',
  MESSAGE: 'Data can not be deleted due to internal server error',
  DATA: {},
});
exports.changePasswordFailure = (data, res) => res.status(responseStatusCode.success).json({
  STATUS: 'FAILURE',
  MESSAGE: `Password cannot be changed due to ${data}`,
  DATA: {},
});
exports.changePasswordSuccess = (data, res) => res.status(responseStatusCode.success).json({
  STATUS: 'SUCCESS',
  MESSAGE: data,
  DATA: {},
});
