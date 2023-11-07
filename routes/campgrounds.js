const express = require('express');
const router = express.Router();

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');

const Campground = require('../models/campground');

const { campgroundValidate } = require('../joiValidationSchema');

// Middleware functions
const validateCampground = (req, res, next) => {
  const { error } = campgroundValidate.validate(req.body);
  if (error) {
    throw new ExpressError(error.message, 400);
  } else next();
};

router.get('/', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

// get
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// Add
router.post(
  '/',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    console.log(campground);
    await campground.save();
    req.flash('success', 'Successfully created a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Get specific campground
router.get(
  '/:id',
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews').populate('author');
    console.log(campground);
    if (!campground) {
      req.flash('error', 'Cannot fint that campground!');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
  })
);

router.get(
  '/:id/edit',
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash('error', 'Cannot fint that campground!');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
  })
);

// Update
router.put(
  '/:id',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    if (!campground) {
      req.flash('error', 'Cannot create that campground!');
      return res.redirect('/campgrounds');
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  '/:id',
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted campground!');
    res.redirect('/campgrounds');
  })
);

module.exports = router;
