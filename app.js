const Sequelize = require('sequelize');
const express = require('express');
const path = require('path');
const booksRoute = require('./routes/books');
const bodyParser = require('body-parser');

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