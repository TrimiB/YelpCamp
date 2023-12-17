const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  title: String,
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});

/**
 * Deletes all reviews associated with a campground document
 * after the campground document is deleted.
 * This ensures reviews are cleaned up and not orphaned.
 */
CampgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

const Campground = mongoose.model('Campground', CampgroundSchema);
module.exports = Campground;
