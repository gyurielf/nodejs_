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
  getMonthlyPlan,
  getToursWithIn,
  getDistances,
  uploadTourImages,
  resizeTourImages
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
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('guide', 'lead-guide', 'admin'), getMonthlyPlan);
router.route('/stats').get(getTourStats);
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithIn);
// tours-distance?distance=233&center=-40,45&unit=km
// tours-distance/233/center/-40,45/km
router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTour
  )
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
