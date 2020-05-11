const express = require('express');

const {
  getCheckOutSession,
  deleteBooking,
  updateBooking,
  getBooking,
  getBookings,
  createBooking,
  getMyBookings
} = require('../controllers/bookingController');

const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

// ALL ENDPOINT PROTECTED BELOW THIS POINT, MUST HAVE LOGGED IN.
router.use(protect);

// Rendered page
router.get('/checkout-session/:tourID', getCheckOutSession);

// API
router.route('/').get(getBookings).post(createBooking);

router.route('/mine').get(getMyBookings);

router
  .route('/:id')
  .get(restrictTo('admin', 'lead-guide'), getBooking)
  .patch(restrictTo('admin', 'lead-guide'), updateBooking)
  .delete(restrictTo('admin', 'lead-guide'), deleteBooking);

module.exports = router;
