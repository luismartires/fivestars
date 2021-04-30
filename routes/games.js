const express = require("express");
const router = express.Router();
const imdb = require("imdb-api");

/* GET home page */
router.get("/games", async (req, res) => {
  res.render("games", {user: req.session.currentUser});
});

router.get("/search-game", async (req, res) => {
  const { theObjectName } = req.query;
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
      return result.type === "game";
    });
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
