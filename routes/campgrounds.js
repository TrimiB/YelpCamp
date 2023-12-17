const express = require('express');
const router = express.Router();

const campground = require('../controllers/campgrounds');

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

const multer = require('multer');
const { storage, cloudinary } = require('../cloudinary');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     cb(null, `${file.originalname.split('.')[0]}-${uniqueSuffix}.${file.mimetype.split('/')[1]}`);
//   },
// });
const upload = multer({ storage });

router
  .route('/')
  // Get all campgrounds
  .get(catchAsync(campground.index))
  // Creating a new campground
  // .post(isLoggedIn, validateCampground, catchAsync(campground.createCampground));
  .post(upload.array('image', 4), (req, res) => {
    console.log(req.body, req.files);
    res.send(`It worked! 👌`);
  });

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
