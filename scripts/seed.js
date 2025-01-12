const db = require("../config/db");

async function seed() {
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    // Clear existing data
    await client.query("DELETE FROM book_authors");
    await client.query("DELETE FROM books");
    await client.query("DELETE FROM authors");
    await client.query("DELETE FROM genres");

    // Insert genres
    const genresData = [
      {
        name: "Fiction",
        description: "Literary works created from imagination",
      },
      { name: "Non-Fiction", description: "Factual and informative works" },
      {
        name: "Science Fiction",
        description: "Speculative fiction based on scientific concepts",
      },
      { name: "Mystery", description: "Stories involving crime or secrets" },
      { name: "Biography", description: "Account of someone's life" },
    ];

    const genres = [];
    for (const genre of genresData) {
      const result = await client.query(
        "INSERT INTO genres (name, description) VALUES ($1, $2) RETURNING id",
        [genre.name, genre.description]
      );
      genres.push(result.rows[0]);
    }

    // Insert authors
    const authorsData = [
      { name: "Jane Doe", bio: "Bestselling author of mystery novels" },
      { name: "John Smith", bio: "Award-winning science fiction writer" },
      { name: "Alice Johnson", bio: "Renowned biographer and historian" },
      { name: "Bob Wilson", bio: "Contemporary fiction author" },
      { name: "Carol Brown", bio: "Expert in non-fiction writing" },
    ];

    const authors = [];
    for (const author of authorsData) {
      const result = await client.query(
        "INSERT INTO authors (name, bio) VALUES ($1, $2) RETURNING id",
        [author.name, author.bio]
      );
      authors.push(result.rows[0]);
    }

    // Insert books
    const booksData = [
      {
        title: "The Mystery of the Lost Key",
        genre_id: genres[3].id, // Mystery
        quantity: 15,
        description:
          "A thrilling mystery novel about a detective solving an ancient puzzle.",
        cover_image: "https://example.com/mystery-key.jpg",
        authors: [authors[0].id], // Jane Doe
      },
      {
        title: "Future Worlds",
        genre_id: genres[2].id, // Science Fiction
        quantity: 20,
        description: "An exploration of possible future civilizations.",
        cover_image: "https://example.com/future-worlds.jpg",
        authors: [authors[1].id], // John Smith
      },
      {
        title: "The Life of Einstein",
        genre_id: genres[4].id, // Biography
        quantity: 10,
        description: "A comprehensive biography of Albert Einstein.",
        cover_image: "https://example.com/einstein-bio.jpg",
        authors: [authors[2].id], // Alice Johnson
      },
      {
        title: "Modern Tales",
        genre_id: genres[0].id, // Fiction
        quantity: 25,
        description: "A collection of contemporary short stories.",
        cover_image: "https://example.com/modern-tales.jpg",
        authors: [authors[3].id, authors[0].id], // Bob Wilson & Jane Doe
      },
      {
        title: "Understanding Our World",
        genre_id: genres[1].id, // Non-Fiction
        quantity: 12,
        description: "An insightful look at modern scientific discoveries.",
        cover_image: "https://example.com/our-world.jpg",
        authors: [authors[4].id], // Carol Brown
      },
    ];

    // Insert books and their author associations
    for (const book of booksData) {
      const {
        title,
        genre_id,
        quantity,
        description,
        cover_image,
        authors: bookAuthors,
      } = book;

      const bookResult = await client.query(
        "INSERT INTO books (title, genre_id, quantity, description, cover_image) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [title, genre_id, quantity, description, cover_image]
      );

      const bookId = bookResult.rows[0].id;

      // Create author associations
      for (const authorId of bookAuthors) {
        await client.query(
          "INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)",
          [bookId, authorId]
        );
      }
    }

    await client.query("COMMIT");
    console.log("✅ Seed data inserted successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error seeding data:", error);
    throw error;
  } finally {
    client.release();
    // We don't need db.end() since we're using a client
    process.exit(0);
  }
}

// Run the seed function
seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
