const express = require("express");
const router = express.Router();
const requireLogin = require("../configs/middleware");
const fileUpload = require("../configs/cloudinary");
const User = require("../models/User.model");
const Hub = require("../models/Hub.model");
const Favorite = require("../models/Favorite.model");
const Rating = require("../models/Rating.model");

/* GET home page */
router.get("/", (req, res) => {
  res.render("index", { user: req.session.currentUser });
});

/* HUB */

 router.get("/hub", async (req, res) => {
  const allShares = await Hub.find().populate("user").populate("rating");
  res.render("hub", { allShares, user: req.session.currentUser });
}); 

/* router.get("/hub", async (req, res) => {
  const allShares = await Hub.find().populate("user").populate("rating");
  const sortHub = allShares.sort((a, b) => b.date - a.date);
  res.render("hub", { sortHub, user: req.session.currentUser });
}); */

router.post("/hub/:favoriteId", async (req, res) => {
  const user = await User.findById(req.session.currentUser._id);
  const favorite = await Favorite.findById(req.params.favoriteId);
  const rating = await Rating.findOne({
    objectId: favorite.objectId,
    user: user,
  });

  if (rating) {
    await Hub.create({
      title: favorite.title,
      poster: favorite.poster,
      user: user,
      rating: rating,
    });
  } else {
    await Hub.create({
      title: favorite.title,
      poster: favorite.poster,
      user: user,
    });
  }

  res.redirect("/hub");
});

router.get("/my-area", requireLogin, async (req, res) => {
  const currentUser = await User.findById(req.session.currentUser._id);
  res.render("auth/my-area", { user: currentUser });
});

router.get("/settings", requireLogin, async (req, res) => {
  const currentUser = await User.findById(req.session.currentUser._id);
  res.render("auth/settings", { user: currentUser });
});

router.post("/settings", fileUpload.single("image"), async (req, res) => {
  // File path (URL) on Cloudinary
  // const fileOnCloudinary = req.file.path;
  const id = req.session.currentUser._id;
  const { username, city } = req.body;
  if (req.file) {
    await User.findByIdAndUpdate(id, {
      username,
      city,
      imageUrl: req.file.path,
    });
  } else {
    await User.findByIdAndUpdate(id, { username, city });
  }

  res.redirect("/my-area");
});

router.post("/my-area", async (req, res) => {
  const id = req.session.currentUser._id;
  const { interests } = req.body;

  await User.findByIdAndUpdate(id, { interests });

  res.redirect("/my-area");
});

router.post("/send-email", (req, res, next) => {
  let { email, subject, message } = req.body;
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "your email address",
      pass: "your email password",
    },
  });
  transporter
    .sendMail({
      from: '"5tars project " <5tars.backendproject@gmail.com>',
      to: email,
      subject: subject,
      text: SignUp,
      html: `<b>${message}</b>`,
    })
    .then((info) => res.render("message", { email, subject, message, info }))
    .catch((error) => console.log(error));
});
module.exports = router;
