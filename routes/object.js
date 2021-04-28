const express = require("express");
const Rating = require("../models/Rating.model");
const User = require("../models/User.model");
const router = express.Router();
const requireLogin = require("../configs/middleware");
const Favorite = require("../models/Favorite.model");

const imdb = require("imdb-api");



/* OBJECT-SEARCH */



router.get("/object-search", async (req, res) => {
  const { theObjectName } = req.query;

  const result = await imdb.search(
    {
      name: theObjectName,
    },
    {
      apiKey: process.env.CLIENT_ID,
    }
  );
  let objects = result.results;

  res.render("object-search-results", { objects, theObjectName, user: req.session.currentUser});
});



/* DETAILS */



router.post("/details/:id/rating", requireLogin, async (req, res) => {
  try {
    const objectId = req.params.id;
    const user = req.session.currentUser._id;
    console.log(user);
    const rating = req.body.rating;
    await Rating.create({
      objectId,
      rating,
      user,
    });
    res.redirect(`/review/${objectId}`);
  } catch (e) {
    res.render("error");
    console.log(`An error occured ${e}`);
  }
});

router.get("/details/:id", async (req, res) => {
  const result = await imdb.get(
    {
      id: req.params.id,
    },
    {
      apiKey: process.env.CLIENT_ID,
    }
  );
  const object = result;
  console.log("in", object);
  res.render("object-details", { object, user: req.session.currentUser });
});



/* FAVORITES */



router.get("/favorites", async (req, res) => {
  const favorites = await Favorite.find({user: req.session.currentUser._id});
  const ratings = await Rating.find({user: req.session.currentUser._id});
  res.render("favorites", { favorites, ratings, user:  req.session.currentUser });
});

router.post("/favorites/:id", async (req, res) => {
  try {
    const objectId = req.params.id; //id do item que adicionas aos Fav.
    const result = await imdb.get(
      {
        id: objectId,
      },
      {
        apiKey: process.env.CLIENT_ID,
      }
    );
    const item = result;
    console.log(item);
    const user = req.session.currentUser._id;
    await Favorite.create({
      objectId,
      title: result.title,
      poster: result.poster,
      user,
    });
    res.redirect(`/details/${objectId}`);
  } catch (e) {
    res.render("error");
    console.log(`An error occured ${e}`);
  }
});



/* ADD-REVIEW */



router.get("/review/:id", async (req, res) => {
  const result = await imdb.get(
    {
      id: req.params.id,
    },
    {
      apiKey: process.env.CLIENT_ID,
    }
  );
  const object = result;
  console.log("in", object);
  res.render("add-review", { object, user: req.session.currentUser });
});

module.exports = router;
