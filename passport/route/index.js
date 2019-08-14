const express = require("express");
const router = express.Router();
// bring in the securedpage
const { ensureAuthenticated } = require("../config/auth");

// Welcome Page
router.get("/", (req, res) => res.render("welcome"));
// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard", {
    user: req.user
  })
);

module.exports = router;
