const mysql = require("mysql2/promise");
require("dotenv").config();
async function seedDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await connection.query(createUsersTable);
    const seedUsers = [
      {
        username: "testuser1",
        email: "test1@example.com",
        password_hash: "hash123",
      },
      {
        username: "testuser2",
        email: "test2@example.com",
        password_hash: "hash456",
      },
    ];
    // Insert seed data
    const insertUserQuery = `
      INSERT INTO users (username, email, password_hash)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE username = VALUES(username), email = VALUES(email), password_hash = VALUES(password_hash);
    `;

    for (const user of seedUsers) {
      await connection.query(insertUserQuery, [user.username, user.email, user.password_hash]);
    }

    console.log("Database seeding completed successfully!");
    await connection.end();
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
}
module.exports = seedDatabase;