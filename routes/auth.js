const express = require("express");
const router = express.Router();
/* const User = require("../models/User.model"); */
const bcrypt = require("bcryptjs");

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
  const { username, email, password } = req.body;
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
    return; //return é para sair da função e assumir o erro
  }
  user = await User.findOne({ email: email });
  if (user !== null) {
    res.render("auth/signup", { errorMessage: "email already exists" });
    return;
  }
  //Create the user in the database
  saltRounds = 10; //encription of encription of encription... 10 times
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt); //hashed password is the pass that users write when registered on the app
  await User.create({
    username,
    email,
    password: hashedPassword,
  });
  res.redirect("/");
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;