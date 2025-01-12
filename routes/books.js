const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { validateBook } = require("../middleware/validate");

// Render books index page
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        books.*, 
        genres.name AS genre_name,
        ARRAY_AGG(authors.name) AS authors
      FROM books
      LEFT JOIN genres ON books.genre_id = genres.id
      LEFT JOIN book_authors ON books.id = book_authors.book_id
      LEFT JOIN authors ON book_authors.author_id = authors.id
      GROUP BY books.id, genres.name
      ORDER BY books.title ASC
    `);
    res.render("books/index", {
      books: result.rows,
      title: "Books Inventory",
    });
  } catch (error) {
    console.error(error);
    res.render("error", { message: "Failed to retrieve books." });
  }
});

// Render create book form
router.get("/add", async (req, res) => {
  try {
    // Get all genres and authors for the form dropdowns
    const genres = await db.query("SELECT * FROM genres ORDER BY name ASC");
    const authors = await db.query("SELECT * FROM authors ORDER BY name ASC");

    res.render("books/create", {
      genres: genres.rows,
      authors: authors.rows,
      title: "Add New Book",
      formData: {}, // Empty form data for new book
    });
  } catch (error) {
    console.error(error);
    res.render("error", { message: "Failed to load form data." });
  }
});

// Create new book (API endpoint)
router.post("/", validateBook, async (req, res) => {
  const { title, genre_id, quantity, description, cover_image, author_ids } =
    req.body;
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    // Check for duplicate title
    const duplicateCheck = await client.query(
      "SELECT id FROM books WHERE LOWER(title) = LOWER($1)",
      [title]
    );
    if (duplicateCheck.rows.length > 0) {
      throw new Error("A book with this title already exists");
    }

    // Create book
    const bookResult = await client.query(
      "INSERT INTO books (title, genre_id, quantity, description, cover_image) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [title, genre_id, quantity, description, cover_image]
    );

    const bookId = bookResult.rows[0].id;

    // Create author associations if author_ids exists
    if (author_ids && author_ids.length > 0) {
      // Handle both single value and array cases
      const authorIdArray = Array.isArray(author_ids)
        ? author_ids
        : [author_ids];
      for (const authorId of authorIdArray) {
        await client.query(
          "INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)",
          [bookId, authorId]
        );
      }
    }

    await client.query("COMMIT");

    // Redirect to books list after successful creation
    res.redirect("/books");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);

    // Reload the form with error message
    const genres = await db.query("SELECT * FROM genres ORDER BY name ASC");
    const authors = await db.query("SELECT * FROM authors ORDER BY name ASC");

    res.render("books/create", {
      genres: genres.rows,
      authors: authors.rows,
      error: error.message,
      title: "Add New Book",
      formData: req.body, // Pass back the form data
    });
  } finally {
    client.release();
  }
});

// Show book details
router.get("/:id", async (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  try {
    const result = await db.query(
      `
      SELECT 
        books.*, 
        genres.name AS genre_name,
        ARRAY_AGG(authors.name) AS authors
      FROM books
      LEFT JOIN genres ON books.genre_id = genres.id
      LEFT JOIN book_authors ON books.id = book_authors.book_id
      LEFT JOIN authors ON book_authors.author_id = authors.id
      WHERE books.id = $1
      GROUP BY books.id, genres.name
    `,
      [bookId]
    );

    if (result.rows.length === 0) {
      return res.render("error", { message: "Book not found." });
    }

    res.render("books/show", {
      book: result.rows[0],
      title: result.rows[0].title,
    });
  } catch (error) {
    console.error(error);
    res.render("error", { message: "Failed to retrieve book." });
  }
});

// Update an existing book
router.put("/:id", async (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const { title, genre_id, quantity, description, cover_image, author_ids } =
    req.body;
  try {
    // Update the book
    const bookResult = await db.query(
      "UPDATE books SET title = $1, genre_id = $2, quantity = $3, description = $4, cover_image = $5 WHERE id = $6 RETURNING *",
      [title, genre_id, quantity, description, cover_image, bookId]
    );

    if (bookResult.rows.length === 0) {
      return res.status(404).json({ message: "Book not found." });
    }

    // Update book_authors
    // First, delete existing associations
    await db.query("DELETE FROM book_authors WHERE book_id = $1", [bookId]);

    // Insert new associations
    if (author_ids && Array.isArray(author_ids)) {
      const insertPromises = author_ids.map((authorId) => {
        return db.query(
          "INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)",
          [bookId, authorId]
        );
      });
      await Promise.all(insertPromises);
    }

    res.json({ message: "Book updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update book." });
  }
});

// Delete a book
router.delete("/:id", async (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  try {
    const result = await db.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [bookId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found." });
    }
    res.json({ message: "Book deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete book." });
  }
});

// Add this route for searching books
router.get("/search", async (req, res) => {
  const { title, author, genre } = req.query;

  try {
    let query = `
      SELECT DISTINCT
        books.*, 
        genres.name AS genre_name,
        ARRAY_AGG(authors.name) AS authors
      FROM books
      LEFT JOIN genres ON books.genre_id = genres.id
      LEFT JOIN book_authors ON books.id = book_authors.book_id
      LEFT JOIN authors ON book_authors.author_id = authors.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    if (title) {
      query += ` AND LOWER(books.title) LIKE LOWER($${paramCount})`;
      params.push(`%${title}%`);
      paramCount++;
    }

    if (genre) {
      query += ` AND LOWER(genres.name) LIKE LOWER($${paramCount})`;
      params.push(`%${genre}%`);
      paramCount++;
    }

    if (author) {
      query += ` AND EXISTS (
        SELECT 1 FROM book_authors ba
        JOIN authors a ON ba.author_id = a.id
        WHERE ba.book_id = books.id
        AND LOWER(a.name) LIKE LOWER($${paramCount})
      )`;
      params.push(`%${author}%`);
    }

    query += ` GROUP BY books.id, genres.name ORDER BY books.title ASC`;

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to search books" });
  }
});

module.exports = router;
