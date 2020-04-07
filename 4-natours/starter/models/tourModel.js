const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');
// const User = require('./userModel'); TURN ON IF YOU USE EMBEDDING

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true, // remove whitespaces before and after of the string.
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters']
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [false, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      // Validation only for strings
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
      // set: (val) => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      // CUSTOM VALIDATION <<<<<<<<<<< NOT GOING TO WORK ON UPDATE
      validate: {
        validator: function (val) {
          //  This only points to current doc on NEW document creation
          return val < this.price; // 100 < 200 - NO Error | 250 < 200 - ERROR
        },
        message: (props) =>
          `Discount price (${props.value}) should be below regular price!`
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
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

// Virtual properties - (Duration in days.) ## NOT USABLE IN A QUERY ##
// ahhoz, hogy ne kelljen tarolni feleslegesen plusz infot a db-ben, ezert firtualis propertiket lehet létrehozni, amiket így tudunk váltogatni/hasznalni.
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// ### DOCUMENT MIDDLEWARES - Mongoose use the middleware conception just like the Express.
// ### 4 main type: document, query, aggregate, and model middleware.

// DOCUMENT MIDDLEWARE: runs before .save() and .create() -- BUT NOT on .insertMany(), update etc...
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  // console.log(this);
  next();
});

/* 
// pre save hook/middleware
tourSchema.pre('save', function (next) {
  console.log('Will save document');
  next();
});

// post middleware
tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
}); 
*/

// QUERY MIDDLEWARE - EVVEL MINDEN (EZZEL A SÉMÁVAL) LEFUTÓ QUERY ELŐTT BELETEHETÜNK EXTRA PARAMÉTEREKET.
// PL USER KEZELÉSNÉL(JOGOSULTSÁGOK) HASZNÁLATOS DOLGOKAT
// REGULAR expression /^find/ - minden find-al kezdodo query- nérvényes lesz.
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

/**
 * Implement EMBEDDING of tour guides.
 * We are collect the users based on guides id, and replace them with the entire user data. and pass into the new tour.
 **
tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(async (id) => await User.findById(id));

  this.guides = await Promise.all(guidesPromises);

  next();
});
 */

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });

  next();
});

// RUN AFTER THE QUERY HAS ALREADY EXECUTED. THEREFORE IT CAN ACCES TO THE DOCUMENTS THAT WERE RETURNED.
// BECAUSE THE QUERY FINISHED AT THIS POINT
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  // console.log(docs); az egész dokumentum, amit visszadott a db query.
  next();
});

// AGGREGATION MIDDLEWARE
// eltüntetjük ebből is a secret-tourokat. Úgy, hogy hozzáadunk még egy match propertyt az aggregation pipeline obj tömbjéhez.
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
