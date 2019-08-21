// INITIAL REQUIRE STATEMENTS AND VARIABLES
const express = require("express");
const app = express();
const sqlite = require("sqlite3");
const path = require("path");
const routes = require("./routes/index");
const books = require("./routes/books");
const sequelize = require("./models").sequelize;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));



app.use("/", routes);
app.use("/books", books);

app.use((req, res, next) => {
  const err = new Error("Ooops I Did It Again! Page Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status === 400) {
    res.render("booknotfound", { error: err.message });
  } else if (err.status === 500) {
    res.render("error", { error: err.message });
  } else {
    res.render("pagenotfound", { error: err });
  }
});

sequelize.sync().then(() => {
  app.listen(3000, () => console.log("Successfully running on localhost:3000!"));
});


module.exports = app;