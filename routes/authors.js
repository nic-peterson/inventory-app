const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Add auth middleware only to protected routes
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM authors ORDER BY name ASC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve authors." });
  }
});

// Get a single author by ID
router.get("/:id", async (req, res) => {
  const authorId = parseInt(req.params.id, 10);
  try {
    const result = await db.query("SELECT * FROM authors WHERE id = $1", [
      authorId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Author not found." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve author." });
  }
});

// For testing, let's make the POST route public for now
router.post("/", async (req, res) => {
  console.log("Received POST request:", req.body);
  try {
    const { name, bio } = req.body;
    const result = await db.query(
      "INSERT INTO authors (name, bio) VALUES ($1, $2) RETURNING id",
      [name, bio]
    );
    console.log("Query result:", result);
    res.status(201).json({
      message: "Author created successfully",
      author_id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to create author." });
  }
});

// Update an existing author
router.put("/:id", async (req, res) => {
  const authorId = parseInt(req.params.id, 10);
  const { name, bio } = req.body;
  try {
    const result = await db.query(
      "UPDATE authors SET name = $1, bio = $2 WHERE id = $3 RETURNING *",
      [name, bio, authorId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Author not found." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update author." });
  }
});

// Delete an author
router.delete("/:id", async (req, res) => {
  const authorId = parseInt(req.params.id, 10);
  try {
    // First check if author has any books
    const bookCheck = await db.query(
      "SELECT * FROM book_authors WHERE author_id = $1",
      [authorId]
    );

    if (bookCheck.rows.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete author with existing books. Remove books first or update their authors.",
      });
    }

    const result = await db.query(
      "DELETE FROM authors WHERE id = $1 RETURNING *",
      [authorId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Author not found." });
    }
    res.json({ message: "Author deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete author." });
  }
});

module.exports = router;
