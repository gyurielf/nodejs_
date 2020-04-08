const express = require('express');

// Auth controller imports
const { protect, restrictTo } = require('../controllers/authController');
// Review controller imports
const {
  getAllReview,
  createReview
} = require('../controllers/reviewController');

// Express router import.
// Added and turned on the { mergeParams: true }, for access to rerouted tour router params.
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReview)
  .post(protect, restrictTo('user'), createReview);

// EXPORT MODULE
module.exports = router;
