const Campground = require('../models/campground');
const Review = require('../models/review');

/** Finding Campground by id in params and creating an new review form the data in the body.
 *  the author if the review is set to the users id.
 *  Both review and campground are then saved.
 *  Success message is flashed and we the redirect to the campground where the review was made.
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

/** We first save some varibles then firs we:
 * Find and update Campgrounds by the id and by pulling all data that match reviews to review id.
 * Then we find and delete reviews by the review id.
 * Success message is created and the we redirect to campground.
 */
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'successfully deleted review!');
  res.redirect(`/campgrounds/${id}`);
};
