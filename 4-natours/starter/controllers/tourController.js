const Tour = require('../models/tourModel');

// READ/LIST ALL TOURS
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    
    // BUILD QUERY
    // 1-a) Filtering

    // A queryt szétszedem részekre @queryObj
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // console.log(req.query, queryObj);

    // 1-b) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    // gte,gt,lt,lte
    // { diffuculty: easy, duration: {$gte: 5} }
    // { duration: { gte: '5' }, difficulty: 'easy' }

    // query filter handling
    const query = Tour.find(JSON.parse(queryStr));

    // QUERY FILTER HANDLING - with Mongoose
    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // EXECUTE QUERY
    const tours = await query;

    res.status(200).json({
      status: 'success',
      requestDate: req.requestTime,
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err
    });
  }
};

// READ/LIST A TOUR BASED ON ID

exports.getTour = async (req, res) => {
  // const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tours: tour
  //   }
  // });

  try {
    const tour = await Tour.findById(req.params.id);
    // The above code is shorthand version of this: Tour.findOne({ _id: req.params.id })

    res.status(200).json({
      status: 'success',
      data: {
        tours: tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err
    });
  }
};

// CREATE A TOUR
exports.createTour = async (req, res) => {
  // Az alábbi verzió ugyan azt csinálja, de még az első az új változón hívja meg a methodot, addig a másodikon pedig direktben a Tour-on hívódik meg.
  // #v1
  // const newTour = new Tour({});
  // newTour.save();
  // #v2
  // Tour.create({});

  try {
    const newTour = await Tour.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err
    });
  }

  /* const newId = tours[tours.length - 1].id + 1;
  // eslint-disable-next-line prefer-object-spread
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    // eslint-disable-next-line no-unused-vars
    (err) => {
      console.log('file write success');
      res.status(200).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  ); */
};

// UPDATE A TOUR BASED ON ID
exports.updateTour = async (req, res) => {
  try {
    const tourObj = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: tourObj
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err
    });
  }
};

// DELETE A TOUR BASED ON ID
exports.deleteTour = async (req, res) => {
  // 204 status = NO CONTENT; usually dont send data back.
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(406).json({
      status: 'Error',
      data: err
    });
  }
};
