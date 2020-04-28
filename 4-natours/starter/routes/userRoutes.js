const express = require('express');

// User controlle imports
const {
  getAllUsers,
  // createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe
} = require('../controllers/userController');

// Auth controller imports
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo
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

// THE PROTECT ACCEPTED ON THE ALL ROUTES THAT COME AFTER THIS POINT
// Thats because middlewares runs in sequence
// Ettől kezdődően minden routen érvényesül a protect!!
router.use(protect);

router.get('/logout', logout);
router.patch('/updateMyPassword', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

// THE PROTECT AND THE RESTRICTTO ACCEPTED ON THE ALL ROUTES THAT COME AFTER THIS POINT
// Thats because middlewares runs in sequence
// Ettől kezdődően minden routen érvényesül a protect!!
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers);
// .post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// EXPORT MODULE
module.exports = router;
