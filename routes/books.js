const express = require("express");
const Sequelize = require("sequelize");
const Book = require("../models").Book;
const router = express.Router();
const Op = Sequelize.Op;


router.get("/", function(req, res, next) {
  Book.findAll({ order: [["Year", "DESC"]] })
    .then(function(books) {
      res.render("index", { books: books, title: "List Of Books" });
    })
    .catch(function(err) {
      next({ status: 500, message: err.message });
    });
});

router.get("/new", function(req, res, next) {
  res.render("newbook", { book: {}, title: "New Book" });
});

// router.get(`/books?search=${searchKeyWord}`, function(req, res, next) {
//   res.render("search", { book: {}, title: "Search" });
// });

// POST REQUEST FOR NEW BOOK
router.post("/new", function(req, res, next) {
  Book.create(req.body)
    .then(function(book) {
      res.redirect("/books/");
    })
    .catch(function(err) {
      if (err.name === "SequelizeValidationError") {
        res.render("newbook", {
          book: Book.build(req.body),
          title: "New Book",
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(err => {
      next({ status: 500, message: err.message });
    });
});

router.get("/:id", function(req, res, next) {
  Book.findByPk(req.params.id)
    .then(function(book) {
      if (book) {
        res.render("updatebook", {
          book: book,
          title: book.title,
          author: book.author,
          genre: book.genre,
          year: book.year
        });
      } else {
        next({ status: 400, message: "The book is not available" });
      }
    })
    .catch(err => {
      next({ status: 500, message: err.message });
    });
});
// POST REQUEST TO UPDATE BOOK
router.post("/:id", function(req, res, next) {
  Book.findByPk(req.params.id)
    .then(function(book) {
      if (book) {
        return book.update(req.body);
      } else {
        next({ status: 400, message: "The book is not available" });
      }
    })
    .then(function() {
      res.redirect("/books");
    })
    .catch(function(err) {
      if (err.name === "SequelizeValidationError") {
        const book = Book.build(req.body);
        book.id = req.params.id;
        res.render("updatebook", {
          book: book,
          title: book.title,
          author: book.author,
          genre: book.genre,
          year: book.year,
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(err => {
      next({ status: 500, message: err.message });
    });
});

router.post("/:id/delete", (req, res, next) => {
  Book.findByPk(req.params.id)
    .then(function(book) {
      if (book) {
        return book.destroy();
      } else {
        next({ status: 400, message: "The book is not available" });
      }
    })
    .then(function(book) {
      res.redirect("/books");
    })
    .catch(err => {
      next({ status: 500, message: err.message });
    });
});


module.exports = router;