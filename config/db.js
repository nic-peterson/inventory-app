require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: "nicpeterson",
  host: "localhost",
  database: "inventory_db",
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

pool.on("connect", () => {
  console.log("Connected to the PostgreSQL database.");
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
