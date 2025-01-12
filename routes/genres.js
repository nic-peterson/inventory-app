const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all genres
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM genres ORDER BY name ASC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve genres." });
  }
});

// Get a single genre by ID
router.get("/:id", async (req, res) => {
  const genreId = parseInt(req.params.id, 10);
  try {
    const result = await db.query("SELECT * FROM genres WHERE id = $1", [
      genreId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Genre not found." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve genre." });
  }
});

// Create a new genre
router.post("/", async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO genres (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create genre." });
  }
});

// Update an existing genre
router.put("/:id", async (req, res) => {
  const genreId = parseInt(req.params.id, 10);
  const { name, description } = req.body;
  try {
    const result = await db.query(
      "UPDATE genres SET name = $1, description = $2 WHERE id = $3 RETURNING *",
      [name, description, genreId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Genre not found." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update genre." });
  }
});

// Delete a genre
router.delete("/:id", async (req, res) => {
  const genreId = parseInt(req.params.id, 10);
  try {
    // Check if any books use this genre
    const bookCheck = await db.query(
      "SELECT id FROM books WHERE genre_id = $1",
      [genreId]
    );

    if (bookCheck.rows.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete genre that has books. Update or delete the books first.",
      });
    }

    const result = await db.query(
      "DELETE FROM genres WHERE id = $1 RETURNING *",
      [genreId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Genre not found." });
    }
    res.json({ message: "Genre deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete genre." });
  }
});

module.exports = router;
