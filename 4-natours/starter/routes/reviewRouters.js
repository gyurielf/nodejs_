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

// THE PROTECT ACCEPTED ON THE ALL ROUTES THAT COME AFTER THIS POINT
// Thats because middlewares runs in sequence
// Ettől kezdődően minden routen érvényesül a protect!!
router.use(protect);

router
  .route('/')
  .get(getAllReview)
  .post(restrictTo('user'), setTourAndUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .delete(restrictTo('user', 'admin'), deleteReview)
  .patch(restrictTo('user', 'admin'), updateReview);

// EXPORT MODULE
module.exports = router;
