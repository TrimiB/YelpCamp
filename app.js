const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');

const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const Campground = require('./models/campground');
const Review = require('./models/review');

const { campgroundValidate, reviewValidate } = require('./joiValidationSchema');
const review = require('./models/review');

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost:27017/yelpCamp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

// use ejs-mate as ejs engine
app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// for parsing the body!
app.use(express.urlencoded({ extended: true }));
// for overriding form methods
app.use(methodOverride('_method'));
// req, res Terminal loggings
app.use(morgan('dev'));

// Middleware fn's
const validateCampground = (req, res, next) => {
  const { error } = campgroundValidate.validate(req.body);
  if (error) {
    throw new ExpressError(error.message, 400);
  } else next();
};

const validateReview = (req, res, next) => {
  const { error } = reviewValidate.validate(req.body);
  if (error) {
    throw new ExpressError(error.message, 400);
  } else next();
};

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

// get
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

// Add
app.post(
  '/campgrounds',
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.Campground) throw new ExpressError('Please specify Campground data!', 400);

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.get(
  '/campgrounds/:id',
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', { campground });
  })
);

app.get(
  '/campgrounds/:id/edit',
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
  })
);

// Update
app.put(
  '/campgrounds/:id',
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
  })
);

////// Routes for posting reviews
app.post(
  '/campgrounds/:id/reviews',
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await Promise.all([review.save(), campground.save()]);
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found!', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No! Something went wrong!';
  res.status(statusCode).render('error', {
    err,
  });
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
