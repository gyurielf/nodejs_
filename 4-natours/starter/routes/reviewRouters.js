const express = require('express');

// Auth controller imports
const { protect, restrictTo } = require('../controllers/authController');
// Review controller imports
const {
  getAllReview,
  createReview,
  deleteReview,
  updateReview,
  getReview,
  setTourAndUserIds
} = require('../controllers/reviewController');

// Express router import.
// Added and turned on the { mergeParams: true }, for access to rerouted tour router params.
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReview)
  .post(protect, restrictTo('user', 'admin'), setTourAndUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .delete(protect, deleteReview)
  .patch(protect, updateReview);

// EXPORT MODULE
module.exports = router;
