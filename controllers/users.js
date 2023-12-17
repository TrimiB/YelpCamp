const User = require('../models/user');

/**
 * Renders the register page.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
module.exports.renderRegisterPage = (req, res) => {
  res.render('users/register');
};

/**
 * Creates a new user account.
 *
 * Extracts the email, username, and password from the request body.
 * Creates a new User instance with email and username.
 * Registers the user with the given password using User.register.
 * Logs the user in with req.login.
 * If successful, flashes a 'success' message and redirects to /campgrounds.
 * If there is an error, flashes the error message and redirects to /register.
 */
module.exports.createUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registerUser = await User.register(user, password);
    req.login(registerUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome to Yelpcamp!');
      res.redirect('/campgrounds');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
};

/**
 * Renders the login page.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
module.exports.renderLoginPage = (req, res) => {
  res.render('users/login');
};

/**
 * Logs the user in.
 *
 * Flashes a 'success' message.
 * Redirects the user to res.locals.returnTo if it exists, otherwise to /campgrounds.
 * Deletes req.session.returnTo after using it.
 */
module.exports.loginUser =
  /** 3# now we can use res.locals.returnTo to redirect the user after login */
  (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  };

/**
 * Logs the user out by calling req.logout.
 * Flashes a 'success' message.
 * Redirects to /campgrounds after logout.
 */
module.exports.logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
  });
};
