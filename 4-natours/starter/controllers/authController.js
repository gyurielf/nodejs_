const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// 129. video 23:00
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
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
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt
    // user can not set role for yourself
    // role: req.body.role
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

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //  1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  //   console.log(token);

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  //  2) Verification - token-
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //   console.log(decoded);

  //  3) Check if user still exists and
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The token does no longer exist.', 401));
  }

  //  4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});

// Using rest params (ES6), which create an array of all arguments that were sepecified.
exports.restrictTo = (...roles) => {
  // Return a new FN, which is the middleware itself
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user
    // IF the current user role not in this array ['admin', 'lead-guide'] (which comes from tour routes), return next error in here.
    if (!roles.includes(req.user.role)) {
      // req.user.role NOT in the roles array ? IF TRUE > ERR > IF FALSE > NEXT
      // Determines whether an array includes a certain element, returning true or false as appropriate

      return next(
        new AppError('You do not have permission to access this route.', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    // return next(new AppError('There is no no user with email address.'), 404);
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random token and
  const resetToken = user.createPasswordResetToken();
  /** We must save the token and the pw change time to the database. BUT we have to skip the validation, for this save. otherwise, we must confirm our password
   * and actualy we forgot this password, thats why we want to reset it.
   **/
  await user.save({ validateBeforeSave: false });
  // 3) Send it back tu user's email.
  
});

exports.resetPassword = (req, res, next) => {};
