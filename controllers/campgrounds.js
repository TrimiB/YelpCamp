const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary/index');

/**
 * Finds all campgrounds from the database, renders the campground index page.
 */
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

/**
 * Renders the new campground form.
 */
module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

/**
 * Creates a new campground from request data, saves it to the database,
 * and redirects to the new campground's detail page.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.author = req.user._id;
  console.log(campground);
  await campground.save();
  req.flash('success', 'Successfully created a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

/**
 * Finds a campground by ID, populates reviews and author,
 * and renders the campground detail page.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.showCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author');
  if (!campground) {
    req.flash('error', 'Cannot fint that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
};

/**
 * Renders the edit form for an existing campground.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @returns {Promise} - Renders the edit form for the campground if found,
 * otherwise flashes an error and redirects to /campgrounds
 */
module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Cannot fint that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
};

/**
 * Updates a campground by ID.
 *
 * Finds the campground by ID, updates it with the data from the request body,
 * handles uploading new images and deleting old images, saves the campground,
 * flashes a success message, and redirects to the campground detail page.
 */
module.exports.updateCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  const images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...images);

  /**
   * Deletes images from the campground if requested in the request body.
   *
   * Loops through the filenames in req.body.deleteImages and deletes each image from
   * Cloudinary. Then updates the campground to pull (remove) any images that match
   * the deleted filenames in our 'mongo' database.
   */
  if (req.body.deleteImages) {
    for (let fileneame of req.body.deleteImages) {
      await cloudinary.uploader.destroy(fileneame);
    }
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }

  await campground.save();
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

/**
 * Deletes a campground by ID.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * Finds the campground by ID and deletes it.
 * Flashes a success message and redirects to /campgrounds.
 */
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'successfully deleted campground!');
  res.redirect('/campgrounds');
};
