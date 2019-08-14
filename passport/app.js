const express = require("express");
const expressLayouts = require("express-ejs-layouts");
// import mongoose
const mongoose = require("mongoose");
// flash and session
const flash = require("connect-flash");
const session = require("express-session");
// Passport
const passport = require("passport");

const app = express();

// Passport config
require("./config/passport")(passport);

// DB config
const db = require("./config/keys").MongoURI;
//connect to Mongo

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected...."))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
  session({
    secret: "keyboard secret",
    resave: true,
    saveUninitialized: true
  })
);
// Add passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global Vars
//for alert color
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", require("./route/index"));
app.use("/users", require("./route/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log("Server start on port ", PORT));
