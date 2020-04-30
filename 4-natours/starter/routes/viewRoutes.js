const express = require('express');

const router = express.Router();

const { isLoggedIn, protect } = require('../controllers/authController');

const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount
} = require('../controllers/viewController');

// isLoggedIn render the page header for the user if logged in. if has protect middleware, thats do the
router.get('/', isLoggedIn, getOverview);

router.get('/tour/:slug', isLoggedIn, getTour);

router.get('/login', isLoggedIn, getLoginForm);

// These routes are protected ( needs to be logged in!)
// router.use(protect);

router.get('/me', protect, getAccount);

module.exports = router;
