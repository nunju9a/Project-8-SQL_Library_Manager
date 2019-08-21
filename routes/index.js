var express = require("express");
var router = express.Router();

// REDIRECT TO BOOKS ROUTE
router.get("/", function(req, res, next) {
  res.redirect("/books");
});

module.exports = router;