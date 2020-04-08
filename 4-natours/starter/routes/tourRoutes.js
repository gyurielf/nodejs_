const express = require('express');
// const tourController = require('./../controllers/tourController');

// Import controllers from the tourController.
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan
} = require('../controllers/tourController');

// Auth controller imports
const { protect, restrictTo } = require('../controllers/authController');

// ReviewRouter import
const reviewRouter = require('./reviewRouters');

// Express router import.
const router = express.Router();

// Rerouting to the review router
router.use('/:tourId/reviews', reviewRouter);

// This val param is hold the id param value in order to get acces to that id
// router.param('id', checkID);
// router.param('', checkBody);

// Create a checkbody middleware
// Check if body contains the name and the price property
// if not return 400(bad request);
// Add it to the post handler stack.

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/stats').get(getTourStats);

router
  .route('/')
  .get(protect, restrictTo('admin', 'lead-guide', 'user'), getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

/* 
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);
 */
/*
// Nested route firs try (without express) 
router
  .route('/:tourId/reviews')
  .post(protect, restrictTo('user'), createReview);

// POST /tour/234fda4/reviews
// GET /tour/234fda4/reviews
// GET /tour/234fda4/reviews/94484846dtr
 */

// EXPORT MODULE
module.exports = router;
