const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Home Route
router.get("/", async (req, res) => {
  try {
    // Get counts from database
    const bookCountQuery = await db.query("SELECT COUNT(*) FROM books");
    const authorCountQuery = await db.query("SELECT COUNT(*) FROM authors");
    const genreCountQuery = await db.query("SELECT COUNT(*) FROM genres");

    const bookCount = parseInt(bookCountQuery.rows[0].count);
    const authorCount = parseInt(authorCountQuery.rows[0].count);
    const genreCount = parseInt(genreCountQuery.rows[0].count);

    res.render("index", {
      title: "Bookstore Inventory",
      bookCount,
      authorCount,
      genreCount,
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    // Still render the page but with default values if there's an error
    res.render("index", {
      title: "Bookstore Inventory",
      bookCount: 0,
      authorCount: 0,
      genreCount: 0,
    });
  }
});

// Test Database Connection
router.get("/test-db", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0].now });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Database connection failed." });
  }
});

module.exports = router;
