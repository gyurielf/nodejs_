const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.getCheckOutSession = catchAsync(async (req, res, next) => {
  // 1) get currently booked tour
  const tour = await Tour.findById(req.params.tourID);
  // 2) create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourID
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: `${req.user.email}`,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: `${tour.summary}`,
        images: ['https://www.natours.dev/img/tours/tour-1-cover.jpg'],
        amount: tour.price * 100, // we have to multiple with 100, because its count in CENTs
        currency: 'usd',
        quantity: 1
      }
    ]
  });
  console.log(session.id);

  // 3) create session as response.
  res.status(200).json({
    status: 'success',
    session
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying.
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();

  await Booking.create({ tour, user, price });

  // res.redirect(`${req.protocol}://${req.get('host')}/`);
  res.redirect(req.originalUrl.split('?')[0]);
});

exports.getMyBookings = catchAsync(async (req, res, next) => {
  const myBookings = await Booking.find({ user: req.user.id });

  const tourIDs = myBookings.map((el) => el.tour);
  const bookings = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      data: bookings
    }
  });
});

exports.getBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);