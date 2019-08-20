// INITIAL REQUIRE STATEMENTS AND VARIABLES
const Sequelize = require('./models').sequelize;
const express = require('express');
const path = require('path');
const Book = require('./models').Book;
const bodyParser = require('body-parser');
const Op = require('sequelize').Op;
const app = express();
const portNum = 3000;

// SERVING THE STATIC FILES LOCATED IN THE PUBLIC FOLDER
app.set("view engine", "pug");                                        // Setting view engine to pug
app.set("views", path.join(__dirname, "views"));                     // Setting views directory
app.use("/static", express.static(path.join(__dirname, "public"))); // Serve static files

// PARSING JSON DATA
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// REDIRECTING FROM HOME ROUTE TO FULL PAGE OF BOOKS
app.get('/', (req, res) => res.redirect('/books/pages/1'));

// SHOWING WHOLE LIST OF BOOKS WITH PAGINATION
app.get('/books/pages/:page', (req, res, next) => {
  const books = [];
  const page = req.params.page;
  const limit = 5;
  const offset = limit * (page - 1);
  Book.findAndCountAll({raw: true, limit, offset})
    .then(libraryData => {
      let numberOfPages = Math.ceil(libraryData.count / limit);
      for(let book in libraryData.rows) {
        books.push(libraryData.rows[book]);
      }
      res.render('index', {
        books: books,
        title: 'All Books',
        pages: numberOfPages
      });
    })
    .catch(err => {
      const error = new Error('Internal Server Error!');
      error.status = 500;
      next(error);
    })
});

// SEARCH FUNCTIONALITY FOR BOOKS
app.get('/books/search', (req, res, next) => {
  let searchTerm = req.query.search;      // Require query searched
  searchTerm = searchTerm.toLowerCase(); // Set to lowercase for more matches
  Book.findAll({                        // Find books that match by title, author, genre, or year
    raw: true,
    where: {
      [Op.or]: [
        {
          title: { [Op.like]: `%${searchTerm}%` }
        }, 
        {
          author: { [Op.like]: `%${searchTerm}%` }
        }, 
        {
          genre: { [Op.like]: `%${searchTerm}%` }
        }, 
        {
          year: { [Op.like]: `%${searchTerm}%` }
        } 
      ]
    }
  })
    .then(searchData => {                               // Render results if match
      res.render('index', {
        books: searchData,
        title: 'Search Results',
        inSearch: true
      });
    })
    .catch(err => {                                // Catch error if no match
      const error = new Error('Internal Server Error!');
      error.status = 500;
      next(error);
    })
})

// SHOWING CREATE NEW BOOK FORM
app.get('/books/new', (req, res) => {
  res.render('new-book', {book: Book.build(), title: 'New Book'});
});

// NEW ROUTE POSTED FOR NEW BOOK ENTERED
app.post('/books/new', (req, res, next) => {
  Book.create(req.body)
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      if(err.name === 'SequelizeValidationError') {
        res.render('new-book', {
          book: Book.build(req.body),
          title: 'New Book',
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(err => {
      const error = new Error('Internal Server Error!');
      error.status = 500;
      next(error);
    })
});

// SHOWS NEW DETAILS WHEN BOOK UPDATED
app.get('/books/:id', (req, res, next) => {
  Book.findByPk(req.params.id)
    .then(book => {
      res.render('update-book', {book: book, title: book.title});
    })
    .catch(err => {
      const error = new Error('Internal Server Error!');
      error.status = 500;
     // next(error);
    })
});

// UPDATE BOOK INFO ENTERED
app.post('/books/:id', (req, res, next) => {
  Book.findByPk(req.params.id)
    .then(book => book.update(req.body))
    .then(book => res.redirect('/'))
    .catch(err => {
      if(err.name === 'SequelizeValidationError') {
        let book = Book.build(req.body);
        book.id = req.params.id;
        res.render('update-book', {
          book: book,
          title: book.title,
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(err => {
      const error = new Error('Internal Server Error!');
      error.status = 500;
      next(error);
    })
});

// DELETES BOOK
app.post('/books/:id/delete', (req, res, next) => {
  Book.findByPk(req.params.id)
    .then(book => book.destroy())
    .then(book => res.redirect('/'))
    .catch(err => {
      const error = new Error('Internal Server Error!');
      error.status = 500;
      next(error);
    })
});

// IGNORE FAVICON.ICO
app.get('/favicon.ico', (req, res) => res.status(204));

// RENDER PAGE NOT FOUND
app.use((req, res) => {
  const error = new Error('Page Not Found!');
  error.status = 404;
  res.render('page-not-found', {error});
});

// ERROR ROUTE
app.use((err, req, res, next) => {
  res.render('error', {error: err});
  console.log(`There was an error with the application: ${err}`);
});

//LISTENING ON PORT
Sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`application is listening on port ${portNum}`);
  });
});



// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: 'library.db'});

// // async IIFE
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection to the database successful!');
//   } catch (error) {
//     console.error('Error connecting to the database: ', error);
//   }
// })();