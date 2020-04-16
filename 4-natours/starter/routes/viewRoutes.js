const express = require('express');

const router = express.Router();

const {
  getOverview,
  getTour,
  login
} = require('../controllers/viewController');

router.get('/', getOverview);

router.get('/tour/:slug', getTour);

router.get('/login', login);

module.exports = router;
