// *Middleware to check if the user is authenticated.

const authMiddleware = (req, res, next) => {
  // *Check if the user is logged in.
  if (req.session.logged_in) {
    // *Check if user data is available in the session.
    if (req.session.user && req.session.user.id) {
      // *Set the userId in the session for easy access.
      req.session.userId = req.session.user.id;
      next(); // *Proceed to the next middleware or route handler.
    } else {
      // *Redirect to the login page if user data is missing.
      res.redirect("/login");
    }
  } else {
    // *Redirect to the login page if the user is not logged in.
    res.redirect("/login");
  }
};

module.exports = authMiddleware;
