const express = require('express');
const { getCheckOutSession } = require ('../controllers/bookingController');
const { protect } = require('../controllers/authController');

const router = express.Router();

router.get('/checkout-session/:tourID', protect, getCheckOutSession);

module.exports = router;
