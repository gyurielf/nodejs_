const mongoose = require('mongoose');

// sajat elgondolas, de inkabb a videoban latottakat csekkolom vegig.
/* const bookingSchema = new mongoose.Schema({
  amount: Number,
  currency: {
    type: String,
    required: [true, 'A purchase must have a currency'],
    // Validation only for strings
    enum: {
      values: ['usd', 'eur'],
      message: 'Currency is either: usd, eur'
    }
  },
  quantity: {
    type: Number,
    required: true
  },
  status: Boolean,
  date: {
    type: Date,
    default: Date.now()
  }
}); */

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!']
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price!']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  }
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: '-__v -passwordChangedAt'
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
