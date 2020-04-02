const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Incorrect email or password.', 400));
  }

  // 2) Chack if the user exist && password is correctPassword
  const user = User.findOne({ email: email, password: password });
  // 3) If everything ok, send token to client

  const token = '';
  res.status(200).json({
    status: 'success',
    token
  });
};
