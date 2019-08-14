const express = require("express");
const router = express.Router();
// encrypt
const bcrypt = require("bcryptjs");
// bring in passport
const passport = require("passport");

// User Model
const User = require("../models/User");

// Login page
router.get("/login", (req, res) => res.render("login"));

// Register page
router.get("/register", (req, res) => res.render("register"));

// Register handle
router.post("/register", (req, res) => {
  // DEBUG:
  //   console.log(req.body);
  //   res.send("Hello");
  const { name, email, password, password2 } = req.body;
  // Validation
  // Check required field
  let errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }
  // Check password matched
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }
  // Check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }
  // check is validation is valid
  if (errors.length > 0) {
    //passing the errors msg to the register page
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Action when it passed => Add to DB
    //DEBUG: res.send("pass");
    //check user is it exist in db or not
    User.findOne({ email: email }).then(user => {
      if (user) {
        //if it exists
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        // if not exists
        const newUser = new User({
          name,
          email,
          password
        });
        console.log(newUser);

        // Hash Password
        // Generate salt
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //set password to hash
            newUser.password = hash;
            //save user
            newUser
              .save()
              .then(user => {
                // flash
                req.flash(
                  "success_msg",
                  " You are now registered and con login now"
                );
                res.redirect("/users/login");
              })
              .catch(err => console.log(err));
          })
        );
      }
    });
  }
});

// Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// Logout Handle
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You have been logout");
  res.redirect("/users/login");
  //this is not withdraw authenticate
});

module.exports = router;
