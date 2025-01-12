const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /authors - Display authors list
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        authors.*,
        COUNT(DISTINCT book_authors.book_id) as book_count
      FROM authors
      LEFT JOIN book_authors ON authors.id = book_authors.author_id
      GROUP BY authors.id
      ORDER BY authors.name ASC
    `);

    // If it's an API request, return JSON
    if (req.headers.accept?.includes("application/json")) {
      return res.json(result.rows);
    }

    // Otherwise render the view
    res.render("authors/index", {
      title: "Authors",
      authors: result.rows,
    });
  } catch (error) {
    console.error(error);
    if (req.headers.accept?.includes("application/json")) {
      return res.status(500).json({ message: "Failed to retrieve authors." });
    }
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to retrieve authors.",
    });
  }
});

// GET /authors/new - Display new author form
router.get("/new", (req, res) => {
  res.render("authors/new", {
    title: "Add New Author",
  });
});

// GET /authors/:id - Display author details
router.get("/:id", async (req, res) => {
  const authorId = parseInt(req.params.id, 10);
  try {
    // Get author details
    const authorResult = await db.query(
      `
      SELECT * FROM authors WHERE id = $1
    `,
      [authorId]
    );

    if (authorResult.rows.length === 0) {
      if (req.headers.accept?.includes("application/json")) {
        return res.status(404).json({ message: "Author not found." });
      }
      return res.status(404).render("error", {
        title: "Error",
        message: "Author not found.",
      });
    }

    // Get author's books with genre information
    const booksResult = await db.query(
      `
      SELECT 
        books.*,
        genres.name as genre_name
      FROM books
      JOIN book_authors ON books.id = book_authors.book_id
      LEFT JOIN genres ON books.genre_id = genres.id
      WHERE book_authors.author_id = $1
      ORDER BY books.title ASC
    `,
      [authorId]
    );

    // If it's an API request, return JSON
    if (req.headers.accept?.includes("application/json")) {
      return res.json({
        ...authorResult.rows[0],
        books: booksResult.rows,
      });
    }

    // Otherwise render the view
    res.render("authors/show", {
      title: authorResult.rows[0].name,
      author: authorResult.rows[0],
      books: booksResult.rows,
    });
  } catch (error) {
    console.error(error);
    if (req.headers.accept?.includes("application/json")) {
      return res.status(500).json({ message: "Failed to retrieve author." });
    }
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to retrieve author.",
    });
  }
});

// GET /authors/:id/edit - Display edit author form
router.get("/:id/edit", async (req, res) => {
  const authorId = parseInt(req.params.id, 10);
  try {
    const result = await db.query("SELECT * FROM authors WHERE id = $1", [
      authorId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Author not found.",
      });
    }

    res.render("authors/edit", {
      title: `Edit ${result.rows[0].name}`,
      author: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to retrieve author.",
    });
  }
});

// POST /authors - Create new author
router.post("/", async (req, res) => {
  try {
    const { name, bio } = req.body;
    const result = await db.query(
      "INSERT INTO authors (name, bio) VALUES ($1, $2) RETURNING *",
      [name, bio]
    );

    if (req.headers.accept?.includes("application/json")) {
      return res.status(201).json({
        message: "Author created successfully",
        author: result.rows[0],
      });
    }

    res.redirect("/authors");
  } catch (error) {
    console.error(error);
    if (req.headers.accept?.includes("application/json")) {
      return res.status(500).json({ message: "Failed to create author." });
    }
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to create author.",
    });
  }
});

// PUT /authors/:id - Update author
router.put("/:id", async (req, res) => {
  const authorId = parseInt(req.params.id, 10);
  const { name, bio } = req.body;
  try {
    const result = await db.query(
      "UPDATE authors SET name = $1, bio = $2 WHERE id = $3 RETURNING *",
      [name, bio, authorId]
    );

    if (result.rows.length === 0) {
      if (req.headers.accept?.includes("application/json")) {
        return res.status(404).json({ message: "Author not found." });
      }
      return res.status(404).render("error", {
        title: "Error",
        message: "Author not found.",
      });
    }

    if (req.headers.accept?.includes("application/json")) {
      return res.json(result.rows[0]);
    }

    res.redirect(`/authors/${authorId}`);
  } catch (error) {
    console.error(error);
    if (req.headers.accept?.includes("application/json")) {
      return res.status(500).json({ message: "Failed to update author." });
    }
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to update author.",
    });
  }
});

// DELETE /authors/:id - Delete author
router.delete("/:id", async (req, res) => {
  const authorId = parseInt(req.params.id, 10);
  try {
    // First check if author has any books
    const bookCheck = await db.query(
      "SELECT * FROM book_authors WHERE author_id = $1 LIMIT 1",
      [authorId]
    );

    if (bookCheck.rows.length > 0) {
      if (req.headers.accept?.includes("application/json")) {
        return res.status(400).json({
          message:
            "Cannot delete author with existing books. Remove books first or update their authors.",
        });
      }
      return res.status(400).render("error", {
        title: "Error",
        message:
          "Cannot delete author with existing books. Remove books first or update their authors.",
      });
    }

    const result = await db.query(
      "DELETE FROM authors WHERE id = $1 RETURNING *",
      [authorId]
    );

    if (result.rows.length === 0) {
      if (req.headers.accept?.includes("application/json")) {
        return res.status(404).json({ message: "Author not found." });
      }
      return res.status(404).render("error", {
        title: "Error",
        message: "Author not found.",
      });
    }

    if (req.headers.accept?.includes("application/json")) {
      return res.json({ message: "Author deleted successfully." });
    }

    res.redirect("/authors");
  } catch (error) {
    console.error(error);
    if (req.headers.accept?.includes("application/json")) {
      return res.status(500).json({ message: "Failed to delete author." });
    }
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to delete author.",
    });
  }
});

module.exports = router;
