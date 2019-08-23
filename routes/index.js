const express = require("express");
const router = express.Router();
const Book = require("../models").Book;
const itemsPerPage = 7; 
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// REDIRECT TO BOOKS ROUTE
router.get("/", function(req, res, next) {
  res.redirect("/books");
});
//-----------------------------------------------------------------------------
// SEARCH FEATURE BELOW
router.get('/search', (req, res) => {                             // Get search route
  const { term } = req.query;

  Book.findAll({where: {[Op.or]: [                             // Searching all terms
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
          res.render('index', {books, term});        // Rendering index with search results
      })
      .catch(err => console.log(err));
     
    });
//---------------------------------------------------------------------------------

// PAGINATION BELOW
router.get("/books", (req, res) => {
    const column = req.query.column || "title";
    const searchKeyWord = req.query.searchKeyWord || "";
    const page = req.query.page || 1;
    Book.findAll({                                      // Searching all books to find total
      where: {
        [column]: {
          [Op.like]: "%" + searchKeyWord + "%"
        }
      }
    }).then(totalBooks => {
      Book.findAll({
        where: {
          [column]: {
            [Op.like]: "%" + searchKeyWord + "%"
          }
        },
        offset: page * itemsPerPage - itemsPerPage,
        limit: itemsPerPage
      })
        .then(books => {
          if (!books || books.length === 0) {                       // If there are no books
            const err = new Error("No books found");
            throw err;
          }
          const totalPages = Math.ceil(totalBooks.length / itemsPerPage); 
          res.render("index", { books, totalPages, column, searchKeyWord }); // Render index with pagination
        })
        .catch(err => {
          res.render("error", { err });
        });
    });
  });

module.exports = router;
