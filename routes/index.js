const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', async (req, res) => {
res.render("index");
});

/* function requireLogin(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
} */

/* router.get('/', (req, res, next) => {
  res.render('index', { user: req.session.currentUser } );
});

router.get("/private", requireLogin, (req, res) => {
  res.render("private");
}); */

router.get("/my-area", async (req, res) => {
  res.render("auth/my-area");
});

router.get("/settings", async (req, res) => {
  res.render("auth/settings");
});



module.exports = router;

