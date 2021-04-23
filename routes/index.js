const express = require('express');
const router  = express.Router();
const imdb = require('imdb-api')

/* GET home page */
router.get('/', async (req, res, next) => {
  const list = await imdb.search({
    name: 'Titanic'
  }, {
    apiKey: process.env.CLIENT_ID
  })

  console.log(list) 
  res.render('index');
});

module.exports = router;


process.env.CLIENT_ID
