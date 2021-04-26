const express = require("express");
const router = express.Router();
const imdb = require("imdb-api");

router.get("/movies", async (req, res) => {
  res.render("movies");
});

router.get("/search-movie", async (req, res) => {
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
  let filteredArr = objects.filter((result) => {
    return result.type === "movie";
  });
  console.log(filteredArr);

  res.render("object-search-results", { objects: filteredArr, theObjectName });
});

module.exports = router;
