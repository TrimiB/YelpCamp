const { campgroundValidate, reviewValidate } = require('./joiValidationSchema');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

// Middleware functions to check if someone is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must login first!');
    return res.redirect('/login');
  }
  next();
};

// Middleware functions to validate the incomming data form req.body
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

// Middleware functions to validate campgrounds form req.body
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundValidate.validate(req.body);
  if (error) {
    throw new ExpressError(error.message, 400);
  } else next();
};

// Middleware functions to check if user is same as author of a campground
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You do not have Permission to do that!');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

// Middleware functions to check if user is same as author of a review
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have Permission to do that!');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
// module.exports = isLoggedIn;
