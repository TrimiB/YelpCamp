const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');

const ExpressError = require('./utils/ExpressError');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

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

// Routes
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

app.get('/', (req, res) => {
  res.render('home');
});

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
