const express = require("express");
const router = express.Router();
const imdb = require("imdb-api");

router.get("/movies", async (req, res) => {
  res.render("movies", { user: req.session.currentUser });
});

router.get("/search-movie", async (req, res) => {
  const { theObjectName } = req.query;
  console.log("searching");
  try {
    const result = await imdb.search(
      {
        name: theObjectName,
      },
      {
        apiKey: process.env.CLIENT_ID,
      }
    );
    let objects = result.results;
    let filteredArr = objects.filter((result) => {
      return result.type === "movie";
    });
    console.log(filteredArr);

    res.render("object-search-results", {
      objects: filteredArr,
      theObjectName,
      user: req.session.currentUser,
    });
  } catch (e) {
    res.render("object-search-results", {
      objects: [],
      theObjectName,
      user: req.session.currentUser,
    });
  }
});

module.exports = router;
