const Review = require('../models/reviewModel');
// const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
// GLOBAL ERROR HANDLER MIDDLEWARE - Express automaticaly know if 4 argument added, that is an error handler middleware.
// const AppError = require('../utils/appError');

// Controllers

exports.getAllReview = catchAsync(async (req, res, next) => {
  // Filter, if there is a tourId, return just only one the matched tour reviews.
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews: reviews
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  // Allow nested routes.
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id; // We get req.user from the PROTECT middleware.
  const newReview = await Review.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      tour: newReview
    }
  });
});
