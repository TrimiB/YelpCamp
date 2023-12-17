const { campgroundValidate, reviewValidate } = require('./joiValidationSchema');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

/**
 * Middleware to check if a user is logged in.
 * If not logged in, saves url to return to after login and
 * redirects to /login with a flash message.
 */
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must login first!');
    return res.redirect('/login');
  }
  next();
};

/**
 * Middleware to validate review data from req.body using Joi schema.
 * Throws ExpressError if Joi validation fails.
 */
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewValidate.validate(req.body);
  if (error) {
    throw new ExpressError(error.message, 400);
  } else next();
};

// Middleware functions to store the last originaURL on the session
module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

/**
 * Middleware to validate campground data from req.body using Joi schema.
 * Throws ExpressError if Joi validation fails.
 */
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundValidate.validate(req.body);
  if (error) {
    throw new ExpressError(error.message, 400);
  } else next();
};

/**
 * Middleware to check if user is author of a campground.
 * If user is not the author, flash error and redirect to campground page.
 */
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You do not have Permission to do that!');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

/**
 * Middleware to check if user is author of a review.
 * If user is not the author, flash error and redirect to campground page.
 */
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have Permission to do that!');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
