const express = require('express');

const router = express.Router();

const { isLoggedIn, protect } = require('../controllers/authController');

const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  getForgotPasswordForm,
  getPasswordResetForm,
  getMyTours
} = require('../controllers/viewController');

const { createBookingCheckout } = require('../controllers/bookingController');

router.get('/password-reset/:tokenId', getPasswordResetForm);
router.get('/forgot-password', getForgotPasswordForm);

// isLoggedIn render the page header for the user if logged in. if has protect middleware, thats do the
router.get('/', createBookingCheckout, isLoggedIn, getOverview);

router.get('/tour/:slug', isLoggedIn, getTour);

router.get('/login', isLoggedIn, getLoginForm);

// These routes are protected ( needs to be logged in!)
// router.use(protect);

router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getMyTours);

module.exports = router;
