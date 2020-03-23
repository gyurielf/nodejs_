const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.disable('x-powered-by');

// ###### 1) MIDDLEWARES
// If we dont use the next at the and, the req res cycle will be stuck.

// console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

app.use(express.json()); 

// Works like a root folder
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ###### 2) TOUR ROUTES
app.use('/api/v1/tours', tourRouter);

// ###### 3) USER ROUTES
app.use('/api/v1/users', userRouter);

// ###### 4) START SERVER
// SERVER
module.exports = app;
