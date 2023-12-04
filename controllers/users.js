const User = require('../models/user');

/** Render register page */
module.exports.renderRegisterPage = (req, res) => {
  res.render('users/register');
};

/** First we try, to save varibles from body of the request.
 *  Then we create a new user with some of the varibales.
 *  With the Psssport module we register (encrypt user and password).
 *  The we login (also with Passpoert) the registered user.
 *  If no errors occur the we fash succes message and redirectto /campgrounds
 *  If an error occurs, we catch it in the catch block, flash the error message and
 *  redirect to the /register page.
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

/** Render login page */
module.exports.renderLoginPage = (req, res) => {
  res.render('users/login');
};

/** redirect user to last known url or just /campgrounds */
module.exports.loginUser =
  /** 3# now we can use res.locals.returnTo to redirect the user after login */
  (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  };

/** Here we call the .logout method form Passport and simply check if there is an error.
 *  If no error occurs then we flash a success message and redirect to /campgrounds.
 */
module.exports.logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
  });
};
