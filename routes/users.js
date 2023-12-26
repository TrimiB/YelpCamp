const express = require('express');
const router = express.Router();

const { storeReturnTo } = require('../middleware');
const passport = require('passport');

const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');

router
  .route('/register')
  /** Get register page */
  .get(users.renderRegisterPage)
  /** Create new user */
  .post(catchAsync(users.createUser));

router
  .route('/login')
  /** Get login page */
  .get(users.renderLoginPage)
  /** Store last visited url before authentication.
   *  Authenticate user with Passport.
   *  If Authentication was successful, we flash a success message and
   */
  .post(
    /** 1# use the storeReturnTo middleware to save the returnTo value from session to res.locals */
    storeReturnTo,
    /** 2# passport.authenticate logs the user in and clears req.session */
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    users.loginUser
  );

router.get('/logout', users.logoutUser);

module.exports = router;
