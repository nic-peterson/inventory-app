-- Drop existing tables if they exist
DROP TABLE IF EXISTS book_authors CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS genres CASCADE;

-- Create tables
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    bio TEXT
);

CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    genre_id INT REFERENCES genres(id) ON DELETE SET NULL,
    quantity INT DEFAULT 0,
    description TEXT,
    cover_image TEXT
);

CREATE TABLE book_authors (
    book_id INT REFERENCES books(id) ON DELETE CASCADE,
    author_id INT REFERENCES authors(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, author_id)
);

-- Insert genres
INSERT INTO genres (name, description) VALUES
    ('Fiction', 'Literary works created from imagination'),
    ('Non-Fiction', 'Factual and informative works'),
    ('Science Fiction', 'Speculative fiction based on scientific concepts'),
    ('Mystery', 'Stories involving crime or secrets'),
    ('Biography', 'Account of someone''s life');

-- Insert authors
INSERT INTO authors (name, bio) VALUES
    ('Jane Doe', 'Bestselling author of mystery novels'),
    ('John Smith', 'Award-winning science fiction writer'),
    ('Alice Johnson', 'Renowned biographer and historian'),
    ('Bob Wilson', 'Contemporary fiction author'),
    ('Carol Brown', 'Expert in non-fiction writing');

-- Insert books and their author associations
WITH inserted_books AS (
    INSERT INTO books (title, genre_id, quantity, description, cover_image)
    VALUES
        ('The Mystery of the Lost Key', 
        (SELECT id FROM genres WHERE name = 'Mystery'), 
        15, 
        'A thrilling mystery novel about a detective solving an ancient puzzle.',
        'https://example.com/mystery-key.jpg'),
        
        ('Future Worlds',
        (SELECT id FROM genres WHERE name = 'Science Fiction'),
        20,
        'An exploration of possible future civilizations.',
        'https://example.com/future-worlds.jpg'),
        
        ('The Life of Einstein',
        (SELECT id FROM genres WHERE name = 'Biography'),
        10,
        'A comprehensive biography of Albert Einstein.',
        'https://example.com/einstein-bio.jpg'),
        
        ('Modern Tales',
        (SELECT id FROM genres WHERE name = 'Fiction'),
        25,
        'A collection of contemporary short stories.',
        'https://example.com/modern-tales.jpg'),
        
        ('Understanding Our World',
        (SELECT id FROM genres WHERE name = 'Non-Fiction'),
        12,
        'An insightful look at modern scientific discoveries.',
        'https://example.com/our-world.jpg')
    RETURNING id, title
)
INSERT INTO book_authors (book_id, author_id)
SELECT 
    b.id,
    a.id
FROM inserted_books b
CROSS JOIN authors a
WHERE 
    (b.title = 'The Mystery of the Lost Key' AND a.name = 'Jane Doe') OR
    (b.title = 'Future Worlds' AND a.name = 'John Smith') OR
    (b.title = 'The Life of Einstein' AND a.name = 'Alice Johnson') OR
    (b.title = 'Modern Tales' AND a.name IN ('Bob Wilson', 'Jane Doe')) OR
    (b.title = 'Understanding Our World' AND a.name = 'Carol Brown'); 