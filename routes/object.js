const express = require("express");
const Rating = require("../models/Rating.model");
const User = require("../models/User.model");
const router = express.Router();
const requireLogin = require("../configs/middleware");
const Favorite = require("../models/Favorite.model");

const imdb = require("imdb-api");

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

  res.render("object-search-results", { objects, theObjectName });
});

router.post("/movie-details/:id/rating", requireLogin, async (req, res) => {
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
    res.redirect(`/movie-details/${objectId}`);
  } catch (e) {
    res.render("error");
    console.log(`An error occured ${e}`);
  }
});

router.get("/movie-details/:id", async (req, res) => {
  const result = await imdb.get(
    {
      id: req.params.id,
    },
    {
      apiKey: process.env.CLIENT_ID,
    }
  );
  const movie = result;
  console.log("in", movie);
  res.render("movies-details", { movie });
});

router.get("/favorites", (req, res) => {
  res.render("auth/favorites");
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
    console.log(result);
    const user = req.session.currentUser._id;
    await Favorite.create({
      objectId,
      title: result.title,
      poster: result.poster,
      user,
    });
    res.redirect(`/movie-details/${objectId}`);
  } catch (e) {
    res.render("error");
    console.log(`An error occured ${e}`);
  }
});

module.exports = router;
