const express = require('express');

// User controlle imports
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe
} = require('../controllers/userController');

// Auth controller imports
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword
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
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.route('/').get(protect, getAllUsers).post(createUser);
router.route('/:id').get(protect, getUser).patch(updateUser).delete(deleteUser);

// EXPORT MODULE
module.exports = router;
