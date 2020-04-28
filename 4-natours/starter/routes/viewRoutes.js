const express = require('express');

const router = express.Router();

const { isLoggedIn, protect } = require('../controllers/authController');

const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount
} = require('../controllers/viewController');

router.get('/', isLoggedIn, getOverview);

router.get('/tour/:slug', isLoggedIn, getTour);

router.get('/login', isLoggedIn, getLoginForm);

// These routes are protected ( needs to be logged in!)
// router.use(protect);

router.get('/me', protect, getAccount);

module.exports = router;
