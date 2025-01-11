const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Home Route
router.get("/", (req, res) => {
  res.render("index", { title: "Bookstore Inventory" });
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
