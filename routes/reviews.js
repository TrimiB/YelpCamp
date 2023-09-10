const express = require('express');
const router = express.Router({ mergeParams: true });

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const Campground = require('../models/campground');
const Review = require('../models/review');

const { reviewValidate } = require('../joiValidationSchema');

// Middleware functions to validate the incomming data form req.body
const validateReview = (req, res, next) => {
  const { error } = reviewValidate.validate(req.body);
  if (error) {
    throw new ExpressError(error.message, 400);
  } else next();
};

router.post(
  '/',
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await Promise.all([review.save(), campground.save()]);
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  '/:reviewId',
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
