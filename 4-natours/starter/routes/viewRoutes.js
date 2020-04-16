const express = require('express');

const router = express.Router();

const { protect } = require('../controllers/authController');

const {
  getOverview,
  getTour,
  getLoginForm
} = require('../controllers/viewController');

router.get('/', getOverview);

router.get('/tour/:slug', protect, getTour);

router.get('/login', getLoginForm);

module.exports = router;
