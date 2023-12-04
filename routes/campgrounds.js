const express = require('express');
const router = express.Router();

const campground = require('../controllers/campgrounds');

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

// Get all campgrounds
router.get('/', catchAsync(campground.index));

// Get New campground form
router.get('/new', isLoggedIn, campground.renderNewForm);

// Creating a new campground
router.post('/', isLoggedIn, validateCampground, catchAsync(campground.createCampground));

// Get specific campground
router.get('/:id', catchAsync(campground.showCampground));

// Get edit form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.renderEditForm));

// Update Campground
router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campground.updateCampground)
);

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campground.deleteCampground));

module.exports = router;
