// ERROR HANDLER MIDDLEWARE - Express automaticaly know if 4 argument added, that is an error handler middleware.
// Global error handler middleware
module.exports = (err, req, res, next) => {
  //   console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
  // console.error('Hello from the error handler');
};
