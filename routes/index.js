const express = require("express");
const router = express.Router();
const requireLogin = require("../configs/middleware");
const fileUpload = require("../configs/cloudinary");
const User = require("../models/User.model")
const bcrypt = require("bcryptjs");


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { user: req.session.currentUser });
});

router.get("/favorites", requireLogin, (req, res) => {
  res.render("favorites", { user: req.session.currentUser });
});

router.get("/my-area", requireLogin, async (req, res) => {
  const user = await User.findById(req.session.currentUser._id)
  res.render("auth/my-area", { user });
});

router.get("/settings", requireLogin, async (req, res) => {
  const user = await User.findById(req.session.currentUser._id)
  res.render("auth/settings", { user });
});


  
  

router.post("/my-area", fileUpload.single("image"), async (req, res) => {
  // File path (URL) on Cloudinary
  const fileOnCloudinary = req.file.path;
  const id = req.session.currentUser._id;
  const { username, password } = req.body;

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (passwordRegex.test(password) === false) {
    res.render("auth/signup", { errorMessage: "Password is too weak" });
    return;
  }

  saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  await User.findByIdAndUpdate(id, { username, password: hashedPassword, imageUrl: fileOnCloudinary });

  res.redirect("/my-area");
});



module.exports = router;
