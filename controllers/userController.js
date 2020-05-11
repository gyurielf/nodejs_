const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const Email = require('../utils/email');

/* 
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const date = new Date();
    const today = `${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}`;
    const time = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
    const uniqueSuffix = `${today}${time}-${Math.round(Math.random() * 1e9)}`;
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${uniqueSuffix}.${ext}`);
  }
}); 
*/

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (file.mimetype.startsWith('image') && mimetype && extname) {
    return cb(null, true);
  }
  cb(
    new AppError(
      `Error: File upload only supports the following filetypes - ${filetypes}`,
      400
    ),
    false
  );
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  // File name parts
  const date = new Date();
  const today = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
  const time = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
  const uniqueSuffix = `${today}${time}-${Math.round(Math.random() * 1e9)}`;

  // we should defile/redefine the file-name, what we would write to the database.
  req.file.filename = `user-${req.user.id}-${uniqueSuffix}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg()
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

/**
 * Filtering fields if are not allowed - and show the allowed field in the request.
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

// replaced with getAll
// exports.getAllUsers = catchAsync(async (req, res) => {
//   const users = await User.find();

//   res.status(200).json({
//     status: 'success',
//     requestDate: req.requestTime,
//     results: users.length,
//     data: {
//       users
//     }
//   });
// });

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// #### User self data update
exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);

  // 1) Create an error if usert POSTs password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This rout not for password updates. Please use /updateMyPassword',
        400
      )
    );

  // 2) Filtered out unwanted fiend names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) update the user document with
  // All the save middleware is not run!
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  await new Email(req.user, '').sendWelcome();

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
    message: 'This route is not yet defined! Please use /signup instead.'
  });
};

// exports.getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!'
//   });
// };

/* exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
}; */

/* exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
}; */

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
// exports.createUser = factory.createOne(User); //Not exist.
exports.updateUser = factory.updateOne(User); // save middlewares is not work - do NOT attempt to update/change passwords here.
exports.deleteUser = factory.deleteOne(User);
