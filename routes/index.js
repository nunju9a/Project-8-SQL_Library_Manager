var express = require("express");
var router = express.Router();
const Book = require("../models").Book;
const itemsPerPage = 20;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;



// REDIRECT TO BOOKS ROUTE
router.get("/", function(req, res, next) {
  res.redirect("/books");
});

router.get('/search', (req, res) => {
  const { term } = req.query;

  Book.findAll({where: {[Op.or]: [
      {
          title: {[Op.like] : '%' + term + '%'}
      },
      {
          author: {[Op.like] : '%' + term + '%'}
      },
      {
          genre: {[Op.like] : '%' + term + '%'}
      },
      {
          year: {[Op.like] : '%' + term + '%'}
      }
  ]}})
      .then(books => {
          res.render('index', {books, term});
      })
      .catch(err => console.log(err));

});

module.exports = router;
