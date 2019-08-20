module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {                        // Define Book Model
      title: {                                                    // Title property
        type: DataTypes.STRING,                                  // DataType is a string
        validate: {
          notEmpty: { msg: "There must be a title!" },         // Validation error
        },
      },
      author: {                                              // Author property
        type: DataTypes.STRING,                             // DataType is a string
        validate: {
        notEmpty: { msg: "There must be an author!" },    // Validation error
        },
      },
      genre: DataTypes.STRING,                         // Genre property: DataType is a string
      year: DataTypes.INTEGER                         // Year property: DataType is an integer
    }, {});
    Book.associate = function(models) {
                                                // Associations can be defined here 
    };
    return Book;
  };