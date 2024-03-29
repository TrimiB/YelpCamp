const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

/**
 * Defines a virtual property 'thumbnail' that returns a URL to a
 * 200px wide version of the image.
 */
ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema({
  images: [ImageSchema],
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
