const express = require("express");
const router = express.Router();

function requireLogin(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
}

router.get("/", (req, res, next) => {
  res.render("index", { user: req.session.currentUser });
});

router.get("/favorites", requireLogin, (req, res) => {
  res.render("favorites", { user: req.session.currentUser });
});

router.get("/my-area", requireLogin, (req, res) => {
  res.render("auth/my-area", { user: req.session.currentUser });
});

router.get("/settings", requireLogin, (req, res) => {
  res.render("auth/settings", { user: req.session.currentUser });
});

module.exports = router;
