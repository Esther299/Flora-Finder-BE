const mysql = require("mysql2/promise");
require("dotenv").config();
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
// checking dot env is up and running
// console.log("Database User:", process.env.DB_USER);
// console.log("Database Host:", process.env.DB_HOST);
// console.log("Database Name:", process.env.DB_NAME);
// console.log("Database Password:", process.env.DB_PASSWORD);
// console.log("Database Port:", process.env.DB_PORT);
module.exports = pool;