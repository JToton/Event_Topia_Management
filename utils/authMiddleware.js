const authMiddleware = (req, res, next) => {
  if (!req.session.logged_in) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

module.exports = authMiddleware;
