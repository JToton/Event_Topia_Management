const authMiddleware = (req, res, next) => {
  if (req.session.logged_in) {
    if (req.session.user && req.session.user.id) {
      // Set the userId in the session
      req.session.userId = req.session.user.id;
      next();
    } else {
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
};

module.exports = authMiddleware;
