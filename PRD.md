# Project Requirements Document (PRD)

## 1. Overview

We will build an **Inventory Management System** focused on managing a small bookstore’s inventory. This application will allow users to:

- Add new books to the inventory (including details such as title, authors, and genre).
- Update existing book information.
- View and filter the list of books.
- Track stock levels (quantity in inventory).

We will use **PostgreSQL** as the database and **Node.js** (with Express) on the server side. Instead of using an ORM, we will interact with the database through **raw SQL** queries (e.g., via the [pg](https://node-postgres.com/) library).

---

## 2. Goals & Objectives

1. **Provide a simple user interface** for staff to manage the bookstore’s inventory.
2. **Maintain accurate inventory records** in real-time.
3. **Allow searching and filtering** of books by title, author, or genre.
4. **Implement CRUD operations** (Create, Read, Update, Delete) for books, genres, and authors.
5. **Ensure data integrity** and consistency in the PostgreSQL database.

---

## 3. Scope & Features

### 3.1. In-Scope

1. **User Authentication (Basic)**
   - (Optional for MVP) Implement a simple session-based or token-based login system.
2. **Author Management**
   - Create new author records (name, bio).
   - Edit existing author details.
   - Associate authors with books (one book can have multiple authors).
3. **Genre Management**
   - Create and edit genres (name, description).
   - Associate books with a genre (one genre per book for simplicity).
4. **Book Management**
   - Create new books (title, quantity, description, cover image, etc.).
   - Associate one genre and one or more authors.
   - Edit existing book details.
   - Delete a book.
   - View book details on a dedicated page.
5. **Search & Filter**
   - Search books by title, author, or partial text.
   - Filter books by genre.

### 3.2. Out-of-Scope

1. **Payments and Checkout** (e.g., full e-commerce functionality).
2. **Complex User Roles & Permissions** (beyond basic login).
3. **Advanced Reporting** (e.g., detailed sales analytics).
4. **Email and Notification System** (for out-of-stock or order updates).

---

## 4. Functional Requirements

1. **Add Book**

   - **Inputs:** Title, Author(s), Genre, Quantity, optional fields (description, cover_image).
   - **Process:** Insert a new record into the `books` table. Establish connections to authors in a join table.
   - **Output:** New book entry visible in the inventory.

2. **Update Book**

   - **Inputs:** Book ID, updated fields.
   - **Process:** Update the relevant rows in the `books` table (and any changed references in the author join table).
   - **Output:** Changes reflected in the inventory list.

3. **Delete Book**

   - **Inputs:** Book ID.
   - **Process:** Remove the book row from the `books` table, remove references from the `book_authors` join table.
   - **Output:** The book no longer appears in the inventory.

4. **View Book**

   - **Inputs:** Book ID.
   - **Process:** Query the `books` table (and optionally join with `authors` and `genres`).
   - **Output:** Display book details, including authors, genre, quantity, description, etc.

5. **Manage Authors**

   - **Create Author**: Insert into `authors` table.
   - **Update Author**: Modify entries in `authors` table.
   - **Associate Book and Author**: Insert rows into the `book_authors` join table.

6. **Manage Genres**

   - **Create Genre**: Insert into `genres` table.
   - **Update Genre**: Modify entries in `genres` table.
   - **Associate Book and Genre**: Link via `books.genre_id`.

7. **Search & Filter**
   - **Inputs:** Search term for title, author name, or partial text. Filter by genre.
   - **Process:** Construct a SQL query (JOIN or subqueries) to find matching records.
   - **Output:** Display matching results.

---

## 5. Non-Functional Requirements

1. **Performance**
   - Typical interactions (CRUD) should respond within 2 seconds.
2. **Reliability**
   - The system should support up to 50 concurrent requests without errors.
3. **Usability**
   - The UI should be easy for bookstore staff to navigate.
4. **Security**
   - Basic authentication to protect inventory routes (optional for MVP).
   - Sanitize SQL inputs or use parameterized queries to prevent SQL injection.
5. **Scalability**
   - The database schema should accommodate additional fields or relationships if needed later.

---

## 6. Technical Stack

1. **Backend**: Node.js (Express.js)
2. **Database**: PostgreSQL
3. **Database Interaction**: [pg](https://node-postgres.com/) library (raw SQL, parameterized queries)
4. **View Engine (Optional)**: EJS or Pug (server-side rendering)
   - Or create a RESTful API and use a front-end framework/library (React, Vue, etc.)
5. **Styling**: CSS or a framework like Bootstrap/Tailwind

---

## 7. Database Design

### 7.1. Entity Relationship

We have three main entities plus one join table for many-to-many relationships between books and authors:

- **genres**: Each book has exactly one genre.
- **authors**: Each book can have multiple authors, and an author can write multiple books.
- **books**: Tracks general book info, linked to one genre.
- **book_authors** (join table): Associates books and authors.

### 7.2. SQL Schema (Example)

```sql
-- 1. Table: authors
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    bio TEXT
);

-- 2. Table: genres
CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

-- 3. Table: books
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    genre_id INT REFERENCES genres (id),
    quantity INT DEFAULT 0,
    description TEXT,
    cover_image TEXT
);

-- 4. Table: book_authors (join table for many-to-many)
CREATE TABLE book_authors (
    book_id INT REFERENCES books (id),
    author_id INT REFERENCES authors (id),
    PRIMARY KEY (book_id, author_id)
);
```
