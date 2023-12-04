const express = require('express');
const router = express.Router({ mergeParams: true });

const reviews = require('../controllers/reviews');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

// Create new review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// Delete review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
