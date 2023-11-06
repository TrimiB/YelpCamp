// const passport = require('passport');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must login first!');
    return res.redirect('/login');
  }
  next();
};

// module.exports = isLoggedIn;
