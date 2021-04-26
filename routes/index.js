const express = require("express");
const router = express.Router();
const requireLogin = require("../configs/middleware");

/* GET home page */
router.get("/", async (req, res) => {
  res.render("index");
});

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
