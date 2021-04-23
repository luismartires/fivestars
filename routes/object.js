const express = require('express');
const router  = express.Router();

const imdb = require('imdb-api')

router.get('/object-search', async (req, res) => {
  const { theObjectName } = req.query;
  console.log(theObjectName)
  const result = await imdb.search({
    name: theObjectName
  }, {
    apiKey: process.env.CLIENT_ID
  })
  let objects = result.results;
  console.log(result)

  res.render('object-search-results', {objects, theObjectName});
});

module.exports = router;
