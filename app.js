// INITIAL REQUIRE STATEMENTS AND VARIABLES
const Sequelize = require('sequelize');
const express = require('express');
const path = require('path');
const booksRoute = require('./routes/books');
const bodyParser = require('body-parser');
const app = express();
const portNum = 3000;

// SERVING THE STATIC FILES LOCATED IN THE PUBLIC FOLDER
app.set("view engine", "pug");                                        // Setting view engine to pug
app.set("views", path.join(__dirname, "views"));                     // Setting views directory
app.use("/static", express.static(path.join(__dirname, "public"))); // Serve static files

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'library.db'});

// async IIFE
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();