const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssDefend = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRouters');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// SET (built-in) server side rendering template engine.
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.disable('x-powered-by');

// ###### 1) GLOBAL MIDDLEWARES
// If we dont use the next at the and, the req res cycle will be stuck.

/**
 * Serving static files
 * Works like a root folder
 * **/
// app.use(express.static(`${__dirname}/public`));
// replaced but same with the top one.
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Set security HTTP headers
 * USE HELMET - PUT IT RIGHT IN THE BEGGINING. FOR SURE
 * **/

app.use(helmet());

/**
 * Development logging
 * IF the running environment is DEV, thats the morgan running and logging in dev mode.
 * **/
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// RATE LIMITER
const limiter = rateLimit({
  max: 100,
  window: 60 * 60 * 1000, // 60*60*1000 = 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

/**
 * BODY PARSER, reading data from body into req.body
 * LIMIT the maximum amount data what we want to receive in a package: { limit: '10kb' }
 * **/
app.use(express.json({ limit: '10kb' }));

/**
 * DATA SANITIZATION against NoSQL query injection
 **/
app.use(mongoSanitize());

/**
 * DATA SANITIZATION against XSS attacks
 **/
app.use(xssDefend());

/**
 * PREVENT PARAMETER POLLUTION - Clean up the query string.
 **/
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

/**
app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next();
}); 
**/

/**
 * Test middleware, sometimes useful.
 *  **/
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'The Forest Hiker',
    user: 'Jonas'
  });
});

app.get('/overview', (req, res) => {
  res.status(200).render('overview', {
    title: 'All tours'
  });
});

app.get('/tour', (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour'
  });
});

app.get('/login', (req, res) => {
  res.status(200).render('login');
});

// ###### 2) TOUR ROUTES
app.use('/api/v1/tours', tourRouter);

// ###### 3) USER ROUTES
app.use('/api/v1/users', userRouter);

// ###### 4) REVIEW ROUTES
app.use('/api/v1/reviews', reviewRouter);

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
