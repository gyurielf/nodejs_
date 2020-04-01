const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.disable('x-powered-by');

// ###### 1) MIDDLEWARES
// If we dont use the next at the and, the req res cycle will be stuck.

// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// Works like a root folder
app.use(express.static(`${__dirname}/public`));

/* 
app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next();
}); 
*/

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ###### 2) TOUR ROUTES
app.use('/api/v1/tours', tourRouter);

// ###### 3) USER ROUTES
app.use('/api/v1/users', userRouter);

// HANDLING UNHANDLED ROUTES -- IMPORTANT TO PUT BOTTOM OF THE CODE.
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Cant find ${req.originalUrl} on this server!`
  // });

  // IF there is an error. the next(err) will automatically jump to the error handler.
  /* const err = new Error(`Cant find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404; */

  // AppError(err.message, err.statusCode); EZZEL LÉP TOVÁBB A GLOBAL ERROR HANDLERHEZ,
  // AMI A MASSAGE ÉS A STATUSCODE ALAPJÁN ADJA VISSZA A HIBÁT/ANNAK JELLEGÉT/FORRÁSÁT
  next(new AppError(`Cant find ${req.originalUrl} on this server!`), 404);
});

// ERROR HANDLER MIDDLEWARE - Express automaticaly know if 4 argument added, that is an error handler middleware.
app.use(globalErrorHandler);

// ###### 4) START SERVER
// SERVER
module.exports = app;
