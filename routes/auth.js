const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate username and password",
    });
    return;
  }
  const user = await User.findOne({ username: username });
  if (user === null) {
    res.render("auth/login", { errorMessage: "Invalid login" });
    return;
  }
  if (bcrypt.compareSync(password, user.password)) {
    req.session.currentUser = user;
    res.redirect("/");
  } else {
    res.render("auth/login", { errorMessage: "Invalid login" });
    return;
  }
});

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  const {
    username,
    email,
    password,
    city = "-",
    imageUrl = "https://res.cloudinary.com/dipcaihd5/image/upload/v1619625208/index/defaultuser_ywbnff.jpg",
    interests,
  } = req.body;
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate username and password",
    });
  }
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (passwordRegex.test(password) === false) {
    res.render("auth/signup", { errorMessage: "Password is too weak" });
    return;
  }
  let user = await User.findOne({ username: username });
  if (user !== null) {
    res.render("auth/signup", { errorMessage: "username already exists" });
    return;
  }
  user = await User.findOne({ email: email });
  if (user !== null) {
    res.render("auth/signup", { errorMessage: "email already exists" });
    return;
  }

  saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  await User.create({
    username,
    email,
    password: hashedPassword,
    city,
    imageUrl,
    interests,
  });
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "5tars.backendproject@gmail.com",
      pass: "5tars2021",
    },
  });
  transporter
    .sendMail({
      from: '"5tars Project " <5tars@project.com>',
      to: email,
      subject: "Login",
      text: "Welcome to 5tars page, Enjoy!",
      html: `<b>you registered, start rating!</b>`,
    })
    .then((info) => res.redirect("/"))
    .catch((error) => console.log(error));
  res.redirect("/");
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
