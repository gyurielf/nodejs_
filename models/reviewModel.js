const mongoose = require('mongoose');
const Tour = require('./tourModel');
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

reviewSchema.index({ rating: -1 });

// Video 169
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

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

// Video 167-168
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // in a static function, the this points to the current model.
  const stats = await this.aggregate([
    {
      // we only select a tour that we actually want to update.
      $match: { tour: tourId }
    },
    {
      // calc statistics themself.
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

/**
 * Video 168 - Calculate and save the avg rating after the document saved,
 * therefore the new calculated avg ratings also saved.
 * In POST Middleware we cennot use next!
 **/
reviewSchema.post('save', function () {
  // this points to the current review

  // The constructor is basically the model, who created that document.
  this.constructor.calcAverageRatings(this.tour);
});

/**
 * Video 167-168
 * We cannot use the POST method, because at this point in time, we no longer have access to the query,
 * because the query has already executed. without the query, we cannot save the review document.
 **/
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

/**
 * Video 167-168
 * In ordrer to be able to run this function here calcAverageRatings() also on update and on delete.
 * So we need to use query middleware that mongoose give us fr these situations.
 * Whit this, we dont have to aceess directly to the current document. And we need to go around by using this.findOne(),
 * and retrieving the current document from the database. We then store it on the current query variable (this.r).
 * we then get access to it in the post middleware.(thats why we need the (this.) )
 * AND ONLY IN THE POST MIDDLEWARE, where we actually calculate the statistics for reviews.
 * Azért kell kez, hogy ne csak save/create esetében kerüljön újra kalkulálásra az qty és avg rating, hanem update és delete műveletkor is.
 * Ezzel nem kapunk direkt hozzáférést a dokumentumhoz, ezért hogy elérjük, használjuk a findOne()-t,
 * ami visszaadja ezt az aktuális dokumentumot a db-ből.
 * eltároljuk a dokumentumot a (this.r) változóban. Azért this, mert így hozzáférhetünk a post middlewareben.
 * CSAK A POST MIDDLEWARE-ben számoljuk ki a reviewek statisztikáit.
 **/
reviewSchema.post(/^findOneAnd/, async function () {
  // this.r = await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
