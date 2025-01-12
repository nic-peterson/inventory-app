require("dotenv").config();
const express = require("express");
const path = require("path");
const indexRouter = require("./routes/index");
const authorsRouter = require("./routes/authors");
const genresRouter = require("./routes/genres");
const booksRouter = require("./routes/books");
const methodOverride = require("method-override");
const db = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { validateBook } = require("./middleware/validate");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/css",
  express.static(path.join(__dirname, "public/css"), {
    setHeaders: (res, path) => {
      res.setHeader("Content-Type", "text/css");
    },
  })
);

// View Engine Setup (Using EJS)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Method Override Middleware
app.use(methodOverride("_method"));

// Routes
app.use("/", indexRouter);
app.use("/authors", authorsRouter); // Use authors router
app.use("/genres", genresRouter); // Use genres router
app.use("/books", booksRouter); // Use books router

// Test database connection
db.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database connected successfully");
  }
});

// Add error handler last
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
