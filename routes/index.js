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

router.get("/my-area", requireLogin, async (req, res) => {
  res.render("auth/my-area", { user: req.session.currentUser });
});

router.get("/settings", requireLogin, async (req, res) => {
  res.render("auth/settings",  { user: req.session.currentUser });
});


router.post("/my-area", fileUpload.single("image"), async (req, res) => {
  // File path (URL) on Cloudinary
  const fileOnCloudinary = req.file.path;
  const id = req.session.currentUser._id;
  const { username } = req.body;

  await User.findByIdAndUpdate(id, { username, imageUrl: fileOnCloudinary });

  res.redirect("/my-area");
});

router.post('/send-email', (req, res, next) => {
  let { email, subject, message } = req.body;
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your email address',
      pass: 'your email password'
    }
  });
  transporter.sendMail({
    from: '"5tars project " <5tars.backendproject@gmail.com>',
    to: email, 
    subject: subject, 
    text: SignUp,
    html: `<b>${message}</b>`
  })
  .then(info => res.render('message', {email, subject, message, info}))
  .catch(error => console.log(error));
});
module.exports = router;
