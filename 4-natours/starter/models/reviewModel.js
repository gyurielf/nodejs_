const mongoose = require('mongoose');
// const slugify = require('slugify');
// const validator = require('validator');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A reviev can not be empty']
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      required: [true, 'A tour must have a duration']
    },
    createdAt: {
      type: Date,
      default: Date.now()
      // select: false
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user.']
    }
  },
  {
    /**
     * Must be set to mongoose scheme object, that the virtual properties could be appear.
     * Ezeket hozza kell adni a mongoose schema obj-hez, hogy az outputba bekeruljenek a virtual propertik.
     **/
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ### VIRTUAL PROPERTIES
// reviewSchema.virtual('durationWeeks').get(function () {
//   return this.duration / 7;
// });

// ### DOCUMENT MIDDLEWARES

// ### QUERY MIDDLEWARES
// Video 155
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });

  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;