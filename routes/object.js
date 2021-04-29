const express = require("express");
const Rating = require("../models/Rating.model");
const router = express.Router();
const requireLogin = require("../configs/middleware");
const Favorite = require("../models/Favorite.model");
const imdb = require("imdb-api");

/* OBJECT-SEARCH */

router.get("/object-search", async (req, res) => {
  try {
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
    res.render("object-search-results", {
      objects,
      theObjectName,
      user: req.session.currentUser,
    });
  } catch (e) {
    res.render("error");
  }
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
  const favorites = await Favorite.find({ user: req.session.currentUser._id });
  const ratings = await Rating.find({ user: req.session.currentUser._id });
  let ratingsIds = ratings.map(rates => {
    return rates.objectId
  })
  res.render("favorites", { favorites, ratings, ratingsIds, user: req.session.currentUser });
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
    const resultFav = await Favorite.find({ objectId: objectId });
    if (resultFav.length === 0) {
      const user = req.session.currentUser._id;
      await Favorite.create({
        objectId,
        title: result.title,
        poster: result.poster,
        user,
      });
      res.redirect("/favorites");
    } else {
      res.redirect("/favorites");
    }
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

router.post('/favorites/:id/delete', async (req, res) => {
  const objectId = req.params.id;
  await Favorite.findByIdAndDelete(objectId);
  res.redirect('/favorites');
});




module.exports = router;
