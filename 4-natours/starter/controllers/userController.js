const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/**
 * Filtering fields if are not allowed
 * newObj[el] = obj[el]; << The newObj elements names(keys) would be equal the obj elements names(keys).
 * @param obj Current object, what we want to check
 * @param allowedFields Allowed fields arguments to be placed within an array. Ex: 'name', 'email', 'address'
 */
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  // One of the easyest way to loop through an object in JS
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    requestDate: req.requestTime,
    results: users.length,
    data: {
      users
    }
  });
});

// #### User self data update
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create an error if usert POSTs password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This rout not for password updates. Please use /updateMyPassword',
        400
      )
    );

  // 2) Filtered out unwanted fiend names that are not alolowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) update the user document with
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // Only works with logged in users, so thats why the req.user.id here. req.user.id stored in the JWT token.
  await User.findByIdAndUpdate(req.user.id, { isActive: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
