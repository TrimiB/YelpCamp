const express = require('express');
const router = express.Router();

const { storeReturnTo } = require('../middleware');
const passport = require('passport');

const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');
const User = require('../models/user');

/** Get register page */
router.get('/register', users.renderRegisterPage);

/** Create new user */
router.post('/register', catchAsync(users.createUser));

/** Get login page */
router.get('/login', users.renderLoginPage);

/** Store last visited url before authentication.
 *  Authenticate user with Passport.
 *  If Authentication was successful, we flash a success message and
 */
router.post(
  '/login',
  /** 1# use the storeReturnTo middleware to save the returnTo value from session to res.locals */
  storeReturnTo,
  /** 2# passport.authenticate logs the user in and clears req.session */
  passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
  users.loginUser
);

router.get('/logout', users.logoutUser);

module.exports = router;
