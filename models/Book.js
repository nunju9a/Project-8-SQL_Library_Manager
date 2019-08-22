"use strict";
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define(                                          //Defining book model
    "Book",
    {
      title: {                                                         // Title property 
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Title is required"
          }
        }
      },
      author: {                                                 // Author property
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Author is required"
          }
        }
      },
      genre: DataTypes.STRING,                           // Genre property
      year: DataTypes.INTEGER                           // Year property
    },
    {
      classMethods: {
        associate: function(models) {}
      }
    }
  );
 return Book;
};