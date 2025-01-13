require("dotenv").config();
const { Pool } = require("pg");

let pool;

try {
  const config = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {
        user: process.env.DB_USER || "nicpeterson",
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB_NAME || "inventory_db",
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || "5432"),
      };

  pool = new Pool(config);

  pool.on("connect", () => {
    console.log("Connected to the PostgreSQL database.");
  });

  pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
  });
} catch (error) {
  console.error("Error creating pool:", error);
  process.exit(-1);
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};
