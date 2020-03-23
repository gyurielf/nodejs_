const express = require('express');
// const tourController = require('./../controllers/tourController');

// Import controllers from the tourController.
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour
} = require('./../controllers/tourController');

const router = express.Router();

router
  .route('/')
  .get(getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

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
