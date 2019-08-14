// this is for secure the page if user now login
module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please Login to view the resource");
    res.redirect("users/login");
  }
};
