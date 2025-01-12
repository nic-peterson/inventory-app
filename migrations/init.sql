-- migrations/init.sql

-- 1. Table: authors
CREATE TABLE IF NOT EXISTS authors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    bio TEXT
);

-- 2. Table: genres
CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

-- 3. Table: books
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    genre_id INT REFERENCES genres(id) ON DELETE SET NULL,
    quantity INT DEFAULT 0,
    description TEXT,
    cover_image TEXT
);

-- 4. Table: book_authors (join table for many-to-many)
CREATE TABLE IF NOT EXISTS book_authors (
    book_id INT REFERENCES books(id) ON DELETE CASCADE,
    author_id INT REFERENCES authors(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, author_id)
);

