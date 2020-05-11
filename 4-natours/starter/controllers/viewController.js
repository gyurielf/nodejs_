const crypto = require('crypto');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tours from our collection
  const tours = await Tour.find();
  // 2) Build templates
  // overview.pug
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get data for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // 2) Build template
  // tour.pug

  // 3) Render template using data from 1)
  // console.log(tour.reviews.length);

  // csak fasz teszt
  // for (let i = 1; i < tour.reviews.length; i++) {
  //   const reviewNr = tour.reviews[i].rating.toString().substr(0, 1) * 1;
  //   console.log('EZ MAR JO', reviewNr);
  // }

  res.status(200).render('tour', {
    title: tour.name,
    tour
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  // const { requestedUrl } = req.query;
  // console.log(requestedUrl);
  // if (requestedUrl) {
  //   res.status(200).render('login', {
  //     title: 'Login'
  //   });
  // }
  res.status(200).render('login', {
    title: 'Login'
  });
});

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'Account Settings'
  });
});

exports.getForgotPasswordForm = catchAsync(async (req, res, next) => {
  res.status(200).render('forgot', {
    title: 'Forgot password'
  });
});

exports.getPasswordResetForm = catchAsync(async (req, res, next) => {
  // console.log(req.params.tokenId);

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.tokenId)
    .digest('hex');

  const userR = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (userR) {
    res.status(200).render('passwordReset', {
      title: 'Password reset page'
    });
  }

  return next(new AppError('Your token expired or doesnt exist', 401));
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  // const bookings = await Booking.find({ user: req.user.id });
  // console.log(bookings);

  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('mytours', {
    title: 'My Tours',
    tours
  });
});
