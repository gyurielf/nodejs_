const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// 
const signToken = (userID) => {
  return jwt.sign({ id: userID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // We control the data what we gonna put into db. just these fields.
  /**
   * if a user tries to manually input a role, we will not store that into the new user,
   * and sane fir the other stuff, like for example a photo.
   **/
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  // 2) Chack if the user exist && password is correct
  const user = await User.findOne({ email }).select('+password');

  /**
   * If there is no user, or password is incorrect (correctPW=false), then return error.
   * We should await here the user promise, because if the user not ready yet, its can be false,
   * user is a document, and wecan use correctPassword method, which created in the userModel.
   **/
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client

  const token = '';
  res.status(200).json({
    status: 'success',
    token
  });
});
