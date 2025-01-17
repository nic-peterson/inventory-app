require("dotenv").config();
const { Pool } = require("pg");

// Grab the DATABASE_URL from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Please set it in your .env (for local dev) or in Railway."
  );
}

// Optional: Decide if you want SSL in production
// (Most hosted Postgres providers require SSL, local often doesn't.)
const ssl =
  process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false;

// Create a new Pool instance
const pool = new Pool({
  connectionString,
  ssl,
});

// Just a convenience to quickly test the DB on startup
pool
  .query("SELECT NOW()")
  .then((res) => {
    console.log("DB connected successfully at:", res.rows[0].now);
  })
  .catch((err) => {
    console.error("Error testing DB connection:", err);
    process.exit(1);
  });

// Export an easy interface for querying
module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};
