// const pool = require('../db/connection.js');

const mysql = require("mysql2/promise");
require("dotenv").config();
async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });
    console.log("Connected to the database successfully!");
    await connection.end();
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}
testConnection();