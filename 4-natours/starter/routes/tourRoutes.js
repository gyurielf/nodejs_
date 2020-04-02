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

const { protect } = require('../controllers/authController');

const router = express.Router();

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

router.route('/').get(protect, getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

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

// EXPORT MODULE
module.exports = router;
