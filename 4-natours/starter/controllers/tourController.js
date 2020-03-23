const fs = require('fs');

// FILE READ AND JSON PARSE
const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    'utf-8',
    (err, data) => {
      if (err) return console.log(`ERROR, file doesn't exist or empty.`);
      return data;
    }
  )
);

exports.checkID = (req, res, next, val) => {
  console.log(`This id is :${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Error',
      data: {
        tour: 'Invalid ID'
      }
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  // console.log(`This value is :${val}`);
  if (!req.body.name || req.body.name.length == 0 || !req.body.price) {
    console.log('Error catched!');
    return res.status(404).json({
      status: 'Error',
      data: {
        tour: `Missing NAME and / or PRICE parameter`
      }
    });
  }
  next();
};

// READ/LIST ALL TOURS
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestDate: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
};

// READ/LIST A TOUR BASED ON ID
exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tours: tour
    }
  });
};

// CREATE A TOUR
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
        console.log('file write success')
      res.status(200).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};

// UPDATE A TOUR BASED ON ID
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updatedTour>'
    }
  });
};

// DELETE A TOUR BASED ON ID
exports.deleteTour = (req, res) => {
  // 204 status = NO CONTENT; usually dont send data back.
  res.status(204).json({
    status: 'success',
    data: null
  });
};
