const Campground = require('../models/campground');
const Review = require('../models/review');

/**
 * Creates a new review for a campground.
 *
 * Finds the campground by ID, creates a new review from the request body,
 * sets the author to the logged in user's ID, pushes the review onto the
 * campground's reviews array, saves the review and campground, flashes a
 * success message, and redirects back to the campground page.
 */
module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await Promise.all([review.save(), campground.save()]);
  req.flash('success', 'Created new review!');
  res.redirect(`/campgrounds/${campground._id}`);
};

/**
 * Deletes a review by ID.
 *
 * Finds the campground by ID, pulls the review from the campground's
 * reviews array, deletes the review by ID, flashes a success message,
 * and redirects back to the campground page.
 */
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'successfully deleted review!');
  res.redirect(`/campgrounds/${id}`);
};
