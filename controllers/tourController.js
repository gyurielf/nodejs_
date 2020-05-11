const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// Aliasing -- PREFILLING QUERY PARTS OF THE REQUEST
exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
  next();
};

// READ/LIST ALL TOURS
// Replaced with getAll
// exports.getAllTours = catchAsync(async (req, res, next) => {
//   // console.log(req.query);

//   // BUILD QUERY
//   // 1-a) Filtering

//   // A queryt szétszedem részekre @queryObj
//   // eslint-disable-next-line node/no-unsupported-features/es-syntax
//   ////const queryObj = { ...req.query };
//   ////const excludedFields = ['page', 'sort', 'limit', 'fields'];
//   ////excludedFields.forEach((el) => delete queryObj[el]);

//   // console.log(req.query, queryObj);

//   // 1-b) ADVANCED FILTERING
//   ////let queryStr = JSON.stringify(queryObj);
//   ////queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//   // console.log(JSON.parse(queryStr));

//   // gte,gt,lt,lte
//   // { diffuculty: easy, duration: {$gte: 5} }
//   // { duration: { gte: '5' }, difficulty: 'easy' }

//   // query filter handling
//   ////let query = Tour.find(JSON.parse(queryStr));

//   // QUERY FILTER HANDLING - with Mongoose
//   // const query = Tour.find()
//   //   .where('duration')
//   //   .equals(5)
//   //   .where('difficulty')
//   //   .equals('easy');

//   //// 2) SORTING
//   //// if (req.query.sort) {
//   ////   const sortBy = req.query.sort.split(',').join(' ');
//   ////   // console.log(sortBy);
//   ////   query = query.sort(sortBy);
//   //// } else {
//   ////   query = query.sort('-createdAt');
//   //// }

//   //  3) FIELD LIMITING
//   //// if (req.query.fields) {
//   ////   // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//   ////   // const fields = x;
//   ////   // query = query.select('name duration price');
//   ////   // console.log(req.query.fields);
//   ////   let fieldsObj = JSON.stringify(req.query.fields);
//   ////   fieldsObj = JSON.parse(fieldsObj.split(',').join(' '));
//   ////   query = query.select(`${fieldsObj}`);
//   ////   console.log(fieldsObj);
//   //// } else {
//   ////   query = query.select('-__v');
//   //// }

//   // 4) PAGINATION
//   // ?page=2&limit=10 ## (page 0, 1-10), (page 1, 11-20), (page 2, 21-30)
//   // trick for convert value to number is * 1, the default value just || 100
//   ////const page = req.query.page * 1 || 1;
//   ////const limit = req.query.limit * 1 || 100;
//   ////const skip = (page - 1) * limit;
//   ////query = query.skip(skip).limit(limit);
//   ////
//   ////if (req.query.page) {
//   ////  const numTours = await Tour.countDocuments();
//   ////  if (skip > numTours) throw new Error('This page does not exist');
//   ////}

//   /* Az API Features class-ból létrehozunk egy új objektumot. Ebbe az objektbe, parseoljuk a query objectet - Tour.find() - és a query stringet,
//     ami az express-ból jön. - req.query -
//     Ezután minden egyes methoddal (advancedFilter,sort,limitFields etc...) amit egymás után meghívok, alapvetően, manipulálom a query-t.
//     További methodokat tudunk majd hozzáadni, úgy ahogy ezeket a methodokat is hozzáadtuk.
//     */
//   // EXECUTE QUERY
//   const features = new APIFeatures(Tour.find(), req.query)
//     .advancedFilter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await features.query;

//   res.status(200).json({
//     status: 'success',
//     requestDate: req.requestTime,
//     results: tours.length,
//     data: {
//       tours
//     }
//   });
// });

// READ/LIST A TOUR BASED ON ID
// Replaced with getOne
// exports.getTour = catchAsync(async (req, res, next) => {
//   // Populating - default
//   // const tour = await Tour.findById(req.params.id).populate('guides');
//   // Populating - advanced, filter some data from output. IN tourModel - middleware
//   const tour = await Tour.findById(req.params.id).populate('reviews');
//   // The above code is shorthand version of this: Tour.findOne({ _id: req.params.id })

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tours: tour
//     }
//   });
// });

// CREATE A TOUR
// Replaced with createOne
// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: newTour
//     }
//   });

//   // Az alábbi verzió ugyan azt csinálja, de még az első az új változón hívja meg a methodot, addig a másodikon pedig direktben a Tour-on hívódik meg.
//   // #v1
//   // const newTour = new Tour({});
//   // newTour.save();
//   // #v2
//   // Tour.create({});
//   // Tour.create({});
//   /* try {
//     const newTour = await Tour.create(req.body);

//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour: newTour
//       }
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'Fail',
//       message: err
//     });
//   }*/

//   /* const newId = tours[tours.length - 1].id + 1;
//   // eslint-disable-next-line prefer-object-spread
//   const newTour = Object.assign({ id: newId }, req.body);
//   tours.push(newTour);
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     // eslint-disable-next-line no-unused-vars
//     (err) => {
//       console.log('file write success');
//       res.status(200).json({
//         status: 'success',
//         data: {
//           tour: newTour
//         }
//       });
//     }
//   );
//   */
// });

// UPDATE A TOUR BASED ON ID
// Replaced with updateOne
/* exports.updateTour = catchAsync(async (req, res, next) => {
  const tourObj = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!tourObj) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tourObj
    }
  });
}); */

// DELETE A TOUR BASED ON ID
// Replaced the deletOne factory

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   // 204 status = NO CONTENT; usually dont send data back.
//   const deletedTour = await Tour.findByIdAndDelete(req.params.id);

//   if (!deletedTour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });

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

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

// upload.single('images'); // produce req.file
// upload.array('images', 5); // produce req.files

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  // console.log(req.files);
  if (!req.files.imageCover || !req.files.images) return next();

  // File name parts
  const date = new Date();
  const today = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
  const time = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
  const uniqueSuffix = `${today}${time}-${Math.round(Math.random() * 1e9)}`;

  // we should defile/redefine the file-name, what we would write to the database.
  req.body.imageCover = `tour-${req.params.id}-${uniqueSuffix}-cover.jpeg`;

  // 1) Cover image
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg()
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];

  /* Az alap kódra így gondoltam, mivel eddig is így volt a megoldás, de ez nem működőképes, mivel ez egy callb fn,
   és a for-each tovább menne a next-re, nem várná meg az összeset. ezért kerül be a MAP megoldás.
  req.files.images.forEach(async (el, i) => {    
    const filename = `tour-${req.params.id}-${uniqueSuffix}-${i + 1}.jpeg`;
    await sharp(req.files.image[el].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg()
      .toFile(`public/img/tours/${filename}`);

    req.body.images.push(filename);
  }); 
  */
  /* Az összes eredményt megvárom és csak azt követően megyek tovább. az összes promise await/resolve-ra kerül és bepusholódik a req.body.images-be */
  await Promise.all(
    req.files.images.map(async (el, i) => {
      const filename = `tour-${req.params.id}-${uniqueSuffix}-${i + 1}.jpeg`;
      await sharp(req.files.images[i].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg()
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        // null - nem groupolok egy fieldre sem ill mezőre.
        // _id: null,
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        numRatings: { $sum: '$ratingsQuantity' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1, numRatings: -1 }
    },
    {
      // NOT EQUAL -- KIVESZI A TALALATOK KOZUL.
      $match: {
        _id: { $ne: 'EASY' }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      tour: stats
    }
  });
});

// REAL BUSINESS PROBLEM -- TÖMB KEZELÉS- UNWINDING and PROJECTING
// Azokat jelenítem meg, ami 2021 es évben voltak és
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021
  const plan = await Tour.aggregate([
    {
      // if the document has an array, we can clone the document other parts for each array element -- date in this case
      $unwind: '$startDates'
    },
    {
      // Select stage
      $match: {
        // tours between yyyy-01-01 & yyyy-12-31
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      // group stage
      $group: {
        // group by month -- Months located in the startDates "column"
        _id: { $month: '$startDates' },
        // Count tours in a month
        numTourStarts: { $sum: 1 },
        // Tour names push into array and show in the response.
        tours: { $push: '$name' }
      }
    },
    {
      // add an extra fields as month and set to value equal with _id
      $addFields: { month: '$_id' }
    },
    {
      // Show or hide elements // columns
      $project: {
        _id: 0
      }
    },
    {
      // Sorting desc based on the tour quentity
      $sort: {
        numTourStarts: -1
      }
    },
    {
      // limit the number of results.
      $limit: 6
    }
  ]);
  // console.log(plan);
  // console.log(year);
  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      tour: plan
    }
  });
});

/* 
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithIn);
// tours-distance?distance=233&center=-40,45&unit=km
// tours-distance/233/center/-40,45/km
 */
// video 170
exports.getToursWithIn = catchAsync(async (req, res, next) => {
  // we need the three following data, these are coming from req.params.
  const { distance, latlng, unit } = req.params;

  // separate latnlng to lat and lng.
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longtitude in the format lat, lng',
        400
      )
    );
  }
  /**
   * We must convert the radius to a special unit called radians
   * In order to get radians we need to divide our distance by the radius of the earth.
   **/
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  /**
   * Important - In geoJSON, the longtitude(lng) declared first, and after than the latitude(lat);
   **/
  const tours = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius]
      }
    }
  });

  // console.log(distance, lat, lng, unit);

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longtitude in the format lat, lng',
        400
      )
    );
  }

  /**
   * Multiplier for the distance calculation.
   * Calculate in meters by default
   **/
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  /* distances.forEach(element => {
}); */

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});

exports.getAllTours = factory.getAll(Tour);
// exports.getTour = factory.getOne(Tour, 'reviews');
exports.getTour = factory.getOne(Tour, {
  path: 'reviews'
});
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);