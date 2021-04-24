const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/series', async (req, res) => {
res.render("series");
});

module.exports = router;

