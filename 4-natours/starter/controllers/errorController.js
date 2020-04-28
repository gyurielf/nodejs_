// ERROR HANDLER MIDDLEWARE - Express automaticaly know if 4 argument added, that is an error handler middleware.
// Global error handler middleware

const AppError = require('../utils/appError');

// 118. video
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// 119. video
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match('"(.*?)"')[0];
  console.log(value);
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};

// 120. video.
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  // console.log(errors);
  const message = `Invalid input data. ${errors.join('. ')}`;
  // console.log(message);
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Token expired. Please log in again!', 401);

const sendErrorDev = (err, req, res) => {
  // A)
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  // B)
  // RENDERED WEBSITE
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong.',
    msg: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  // A) If url contain API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // Programming or other unknown error: don't leak error details.
    // 1) Long error
    console.log('ERR', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: '500 | Something went very wrong!'
    });
  }
  // B) RENDERED WEBSITE
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong.',
      msg: `${err.message} ${err.statusCode}`
      // Programming or other unknown error: don't leak error details.
    });
  }
  // console.log('ERR', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong...',
    msg: 'Please try again later... '
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  // err.message = err.message || 'Something went wrong. Please try again later';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // TRICK for HARDCOPY -- destructuring { ...variable }.
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };
    /* HA az errorunk CastError, akkor átadjuk a hibát a handleCastErrorDB-nek, amely az AppError-unkal fog visszatérni,
     * és ez lesz az amit a kliens felé fogunk küldeni.
     */
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    // 11000 is a mongoose douplication error code.
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    if (error.name === 'JsonWebTokenError') error = handleJWTError();

    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }

  // console.error('Hello from the error handler');
};
