const bcrypt = require("bcrypt");
const db = require("../config/db");

const seedUser = async () => {
  const username = "admin";
  const password = "password123"; // Choose a strong password

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING",
      [username, hashedPassword]
    );
    console.log("User seeded successfully.");
    process.exit();
  } catch (error) {
    console.error("Error seeding user:", error);
    process.exit(1);
  }
};

seedUser(); 