const express = require('express');
const router = express.Router();

const campground = require('../controllers/campgrounds');

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

router
  .route('/')
  // Get all campgrounds
  .get(catchAsync(campground.index))
  // Creating a new campground
  .post(isLoggedIn, validateCampground, catchAsync(campground.createCampground));

// Get New campground form [Order matters on this line]
router.get('/new', isLoggedIn, campground.renderNewForm);

router
  .route('/:id')
  // Get specific campground
  .get(catchAsync(campground.showCampground))
  // Update Campground
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campground.updateCampground))
  // Delete Campground
  .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground));

// Get edit form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.renderEditForm));

module.exports = router;
