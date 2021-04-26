const express = require("express");
const router = express.Router();
const imdb = require("imdb-api");

router.get("/series", async (req, res) => {
  res.render("series");
});

router.get("/search-series", async (req, res) => {
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
    return result.type === 'series';
  });
  console.log(filteredArr);

  res.render("object-search-results", { objects: filteredArr, theObjectName });
});

module.exports = router;
