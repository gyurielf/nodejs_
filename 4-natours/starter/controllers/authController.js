const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

// 129. video 23:00
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

/**
 * Create and send JWT token & http code & user data.
 * send JWT token as cookie.
 * @param user Current user (we would look user._id after)
 * @param statusCode HTTP status code
 * @param res The res object is available everywhere! Not need to create the variable.
 */
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  //////// Cookie settings and options.
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: false,
    httpOnly: true
  };

  // In production cookies works only in HTTPS if secure = true
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Hide the password from the output. [WE NOT USE user.save(), so it doesnt change any at our DB]
  user.password = undefined;

  // Stay same as before.
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user
    }
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
  // Ezzel helyettesítem a lenti kódot. Delegalva lett FN-be.
  createSendToken(newUser, 201, res);
  /*  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  }); */
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
  createSendToken(user, 200, res);
  /* const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  }); */
});

exports.logout = catchAsync(async (req, res, next) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 1 * 2000),
    secure: false,
    httpOnly: true
  };
  res.cookie('jwt', 'youAreLoggedOut', cookieOptions);

  res.status(200).json({
    status: 'success'
  });
});

// Protection
exports.protect = catchAsync(async (req, res, next) => {
  //  1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies) {
    token = req.cookies.jwt;
  }
  //   console.log(token);

  if (!token) {
    // A) Only for rendered pages
    if (!req.originalUrl.startsWith('/api')) {
      return res.redirect(`/login?requestedUrl=${req.originalUrl}`);
    }
    // B) return err msg for API
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
  res.locals.user = currentUser;

  next();
});

/*
 * Only for RENDERED PAGES pages, no errors! IF the the user is logged in, RENDER the page as a logged in user
 * */
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      //  1) Verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      //  2) Check if user still exists and
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      //  3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER.
      res.locals.user = currentUser;
      return next();
    }
  } catch (err) {
    return next();
  }
  next();
};

/**
 * Restrict this endpoint for the users. Only allowed to the added roles.
 * @param {String} roles ('admin', 'member', 'guest')
 * @returns return a new FN, which is the middleware itself
 */
exports.restrictTo = (...roles) => {
  // Using rest params (ES6), which create an array of all arguments that were sepecified.
  // Return a new FN, which is the middleware itself
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    // IF the current user role not in this array ['admin', 'lead-guide'] (which comes from tour routes), return next error in here.
    if (!roles.includes(req.user.role)) {
      // req.user.role NOT in the roles array ? IF TRUE > ERR, IF FALSE > NEXT
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
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request wit your new password and passwordConfirm to: ${resetURL}\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      // or use req.body.email
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token, encrypt the user token (for be same as the encrypted token in the database)
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token not expired, and there is user, set the new password.
  if (!user) {
    return next(
      new AppError('Password reset token expired. Please Try again..', 400)
    );
  }
  // Set the new password and confirm, and delete the reset token end expiration date aswell.
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property at the user level
  // DONE in the userModel.

  // 4) Log the user in, send JWT.
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get the user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if the POSTed current password is correct
  /**
   * If there is no user, or password is incorrect (correctPW=false), then return error.
   * We should await here the user promise, because if the user not ready yet, its can be false,
   * user is a document, and wecan use correctPassword method, which created in the userModel.
   **/
  if (
    !user ||
    !(await user.correctPassword(req.body.currentPassword, user.password))
  ) {
    return next(
      new AppError('The old password is not correct, please try again..', 401)
    );
  }
  // 3) If the pw is correct, then update the password.
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  // AWAIT!! USE AWAIT ..
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user In, send JWT.
  createSendToken(user, 200, res);
});
