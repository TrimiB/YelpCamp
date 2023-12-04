const Campground = require('../models/campground');

// Finding all campgrounds and rendering them
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

// Simply rendering the NEW campgrounds form
module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

/** Crating new Campground, adding author to Campground, Saving and redirecting 
    to the created Campground */
module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Successfully created a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

/** Finding Campground, populating with reviews and author of review.
 *  Then populating author of created Campground.
 *  Rednering the found Campground
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

/** Finding Campground by id then rendering the found Campgrond */
module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Cannot fint that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
};

/** Finding and updating Campground with the Campground data in the body.
 * Then redirecting to the updated Campground.
 */
module.exports.updateCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

/** Finding Campground by id and deleting the Campground.
 *  Success message is shown then redirecting to the /campgrounds.
 */
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'successfully deleted campground!');
  res.redirect('/campgrounds');
};
