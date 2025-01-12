const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all genres (HTML view)
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT g.*, COUNT(b.id) as book_count 
      FROM genres g 
      LEFT JOIN books b ON g.id = b.genre_id 
      GROUP BY g.id 
      ORDER BY g.name ASC
    `);
    res.render("genres/index", {
      genres: result.rows,
      title: "Genres",
    });
  } catch (error) {
    console.error(error);
    res.render("error", {
      message: "Failed to retrieve genres.",
      title: "Error",
    });
  }
});

// Display new genre form
router.get("/new", (req, res) => {
  res.render("genres/new", { title: "Add New Genre" });
});

// Create a new genre
router.post("/", async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO genres (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
    res.redirect(`/genres/${result.rows[0].id}`);
  } catch (error) {
    console.error(error);
    res.render("error", {
      message: "Failed to create genre.",
      title: "Error",
    });
  }
});

// Display edit genre form
router.get("/:id/edit", async (req, res) => {
  const genreId = parseInt(req.params.id, 10);
  try {
    const result = await db.query("SELECT * FROM genres WHERE id = $1", [
      genreId,
    ]);
    if (result.rows.length === 0) {
      return res.render("error", {
        message: "Genre not found.",
        title: "Error",
      });
    }
    res.render("genres/edit", {
      genre: result.rows[0],
      title: `Edit ${result.rows[0].name}`,
    });
  } catch (error) {
    console.error(error);
    res.render("error", {
      message: "Failed to retrieve genre.",
      title: "Error",
    });
  }
});

// Show genre details
router.get("/:id", async (req, res) => {
  const genreId = parseInt(req.params.id, 10);
  try {
    // Get genre details
    const genreResult = await db.query("SELECT * FROM genres WHERE id = $1", [
      genreId,
    ]);

    if (genreResult.rows.length === 0) {
      return res.render("error", {
        message: "Genre not found.",
        title: "Error",
      });
    }

    // Get books in this genre with their authors
    const booksResult = await db.query(
      `
      SELECT b.*, 
             ARRAY_AGG(json_build_object('id', a.id, 'name', a.name)) as authors
      FROM books b
      LEFT JOIN book_authors ba ON b.id = ba.book_id
      LEFT JOIN authors a ON ba.author_id = a.id
      WHERE b.genre_id = $1
      GROUP BY b.id
      ORDER BY b.title ASC
    `,
      [genreId]
    );

    res.render("genres/show", {
      genre: genreResult.rows[0],
      books: booksResult.rows,
      title: genreResult.rows[0].name,
    });
  } catch (error) {
    console.error(error);
    res.render("error", {
      message: "Failed to retrieve genre details.",
      title: "Error",
    });
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
    res.redirect("/genres");
  } catch (error) {
    console.error(error);
    res.render("error", {
      message: "Failed to delete genre.",
      title: "Error",
    });
  }
});

module.exports = router;
