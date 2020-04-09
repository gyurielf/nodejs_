const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

/**
 *
 * @param {*} Model Data model name Eg: User, Tour, Review etc..
 */
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // 204 status = NO CONTENT; usually dont send data back.
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

/**
 *
 * @param {*} Model Data model name Eg: User, Tour, Review etc..
 */
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const docObj = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!docObj) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: docObj
      }
    });
  });

/**
 *
 * @param {*} Model Data model name Eg: User, Tour, Review etc..
 */
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

/**
 *
 * @param {*} Model Data model name Eg: User, Tour, Review etc..
 * @param {*} populateOptions
 */
exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

/**
 *
 * @param {*} Model Data model name Eg: User, Tour, Review etc..
 */
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour. (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .advancedFilter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      requestDate: req.requestTime,
      results: docs.length,
      data: {
        data: docs
      }
    });
  });
