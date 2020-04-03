const express = require('express');

// User controlle imports
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Auth controller imports
const {
  signup,
  login,
  forgotPassword
} = require('../controllers/authController');

// Express router import.
const router = express.Router();

/**
 * Here the example of not rest philosophy - sometimes need this.
 * In case of signup we dont need get or update methods, because its a signup. So we need only POST method.
 **/
router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
// router.post('/resetPassword', resetPassword);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// EXPORT MODULE
module.exports = router;
