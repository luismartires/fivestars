<<<<<<< HEAD
const express = require('express');
const Rating = require("../models/Rating.model");
const User = require("../models/User.model");
const router = express.Router();
const requireLogin = require("../configs/middleware")
=======
const express = require("express");
const router = express.Router();
>>>>>>> af7b66e89bfa979d920054e4a0f4770dcb880b9e

const imdb = require("imdb-api");

router.get("/object-search", async (req, res) => {
  const { theObjectName } = req.query;

<<<<<<< HEAD

  const result = await imdb.search({
    name: theObjectName,
  }, {
    apiKey: process.env.CLIENT_ID
  })
  let objects = result.results;



  res.render('object-search-results', { objects, theObjectName });
});

router.get('/movie-details/:movieName', async (req, res) => {
  const result = await imdb.search({
    name: req.params.movieName,
  }, {
    apiKey: process.env.CLIENT_ID
  });
  const movie = result.results[0];
  console.log('in', movie)
  res.render('movies-details', { movie });
=======
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
>>>>>>> af7b66e89bfa979d920054e4a0f4770dcb880b9e
});

router.post('/movie-details/:movieName/rating', requireLogin, async (req, res) => {
  const objectid = req.params.movieName;
  const user = req.session.currentUser.id;
  const rating = req.body;
  await Rating.create({
    objectid,
    rating,
    user
  });
  res.redirect('/movie-details/:movieName')
});



module.exports = router;