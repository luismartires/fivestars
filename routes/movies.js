const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/movies', async (req, res) => {
res.render("movies");
});

module.exports = router;

