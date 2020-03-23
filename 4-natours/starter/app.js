const fs = require('fs');
const express = require('express');
const app = express();
const morgan = require('morgan');

app.disable('x-powered-by');

// ###### 1) MIDDLEWARES
// If we dont use the next at the and, the req res cycle will be stuck.
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`,
    'utf-8',
    (err, data) => {
      if (err) return console.log(`ERROR, file doesn't exist or empty.`);
      return data;
    }
  )
);
// ###### 2) ROUTE HANDLERS
// READ/LIST ALL TOURS
const getAllTours = (req, res) => {
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
const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'error',
      message: 'Invalid ID'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tours: tour
    }
  });
};

// CREATE A TOUR
const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
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
const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Error',
      data: {
        tour: 'Invalid ID'
      }
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updatedTour>'
    }
  });
};

// DELETE A TOUR BASED ON ID
const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Error',
      data: {
        tour: 'Invalid ID'
      }
    });
  }
  // 204 status = NO CONTENT; usually dont send data back.
  res.status(204).json({
    status: 'success',
    data: null
  });
};
// 3) ###### USER ROUT HANDLERS
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

// EVEN BETTER THAN THE TOP
// 4) ###### ROUTES
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter
  .route('/')
  .get(getAllTours)
  .post(createTour);

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// ###### USER ROUTES
userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);

userRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// ###### 5) START SERVER
// SERVER
const port = 8000;
app.listen(port, () => {
  console.log(`Appp running on port ${port}`);
});
