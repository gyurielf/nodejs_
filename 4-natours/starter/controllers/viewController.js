const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tours from our collection
  const tours = await Tour.find();
  // 2) Build templates
  // overview.pug
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get data for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  // 2) Build template
  // tour.pug

  // 3) Render template using data from 1)
  // console.log(tour.reviews.length);

  // csak fasz teszt
  // for (let i = 1; i < tour.reviews.length; i++) {
  //   const reviewNr = tour.reviews[i].rating.toString().substr(0, 1) * 1;
  //   console.log('EZ MAR JO', reviewNr);
  // }

  res.status(200).render('tour', {
    title: tour.name,
    tour
  });
});

exports.login = (req, res) => {
  res.status(200).render('login', {
    blba: 'sadsad'
  });
};
