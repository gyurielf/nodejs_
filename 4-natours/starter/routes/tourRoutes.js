const express = require('express');
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

const router = express.Router();

router
  .route('/')
  .get(getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

  
// EXPORT MODULE
module.exports = router;