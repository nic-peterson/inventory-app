require("dotenv").config(); // Load environment variables
const { Pool } = require("pg"); // Postgres client
const fs = require("fs"); // For reading file
const path = require("path"); // For handling file paths

// 1. Create a new pool using the DATABASE_URL (Railway sets this in the environment)
const pool = new Pool({
  connectionString: process.env.DATABASE_PUBLIC_URL,
  // If you're on Railway, you usually need SSL in production:
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// 2. Read the seed SQL file
const seedFilePath = path.join(__dirname, "seed.sql");
const seedSql = fs.readFileSync(seedFilePath, "utf8");

// 3. Execute the seed SQL
pool
  .query(seedSql)
  .then(() => {
    console.log("Database seeded successfully!");
    // 4. Close the connection
    return pool.end();
  })
  .catch((err) => {
    console.error("Error executing seed script:", err);
    pool.end();
  });
