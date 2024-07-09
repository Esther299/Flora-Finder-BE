const pool = require("../db/connection");
const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

exports.selectAllUsers = async (order = "desc") => {
  try {
    const validOrderBy = ["ASC", "DESC"];
    if (order && !validOrderBy.includes(order.toUpperCase())) {
      return Promise.reject({
        status: 400,
        msg: "Bad query request",
      });
    }
    const orderDirection = order.toLowerCase() === "asc" ? "ASC" : "DESC";
    const query = `
      SELECT ua.*, COALESCE(SUM(uc.matchScore), 0) AS total_score
      FROM UserAccount ua
      LEFT JOIN UserCollection uc ON ua.username = uc.username
      GROUP BY ua.username
      ORDER BY total_score ${orderDirection};
    `;

    const [rows] = await pool.query(query);

    rows.forEach((row) => {
      row.dateStamp = moment(row.dateStamp).format("YYYY-MM-DD HH:mm:ss");
      row.total_score = Number(row.total_score);
    });

    return rows;
  } catch (error) {
    throw error;
  }
};

exports.selectUserById = async (username) => {
  try {
    const [rows] = await pool.query(
      "SELECT *, (SELECT COALESCE(SUM(matchScore), 0) FROM UserCollection WHERE username = ?) AS total_score FROM UserAccount WHERE username = ?",
      [username, username]
    );
    if (!rows[0]) {
      throw { status: 404, msg: "User not found" };
    }
    rows[0].total_score = Number(rows[0].total_score);
    rows[0].dateStamp = moment(rows[0].dateStamp).format("YYYY-MM-DD HH:mm:ss");
    return rows[0];
  } catch (error) {
    throw error;
  }
};

exports.createUser = async (newUser) => {
  const { username, name, email, password } = newUser;
  if (!username || !name || !email || !password) {
    return Promise.reject({
      status: 400,
      msg: "Invalid input",
    });
  }
  const expectedTypes = {
    username: "string",
    name: "string",
    email: "string",
    password: "string",
  };
  for (const key in expectedTypes) {
    if (
      newUser[key] !== undefined &&
      typeof newUser[key] !== expectedTypes[key]
    ) {
      return Promise.reject({
        status: 400,
        msg: "Bad request",
      });
    }
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `
      INSERT INTO UserAccount (username, name, email, password, avatar)
      VALUES (?, ?, ?, ?, ?)
    `;
    const defaultAvatar =
      "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg";

    const [result] = await pool.query(sql, [
      username,
      name,
      email,
      hashedPassword,
      defaultAvatar,
    ]);
    const [rows] = await pool.query(
      "SELECT * FROM UserAccount WHERE username = ?",
      [username]
    );
    rows[0].dateStamp = moment(rows[0].dateStamp).format("YYYY-MM-DD HH:mm:ss");
    return rows[0];
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return Promise.reject({
        status: 400,
        msg: "User already exists",
      });
    }
    throw error;
  }
};

exports.checkUserExists = async (username) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM UserAccount WHERE username = ?",
      [username]
    );
    if (!rows[0]) {
      throw { status: 404, msg: "User not found" };
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return Promise.reject({
        status: 400,
        msg: "User already exists",
      });
    }
    throw error;
  }
};

exports.deleteUser = async (username) => {
  try {
    await pool.query("START TRANSACTION");
    await pool.query("DELETE FROM UserCollection WHERE username = ?", [
      username,
    ]);

    const [result] = await pool.query(
      "DELETE FROM UserAccount WHERE username = ?",
      [username]
    );

    await pool.query("COMMIT");

    return result.affectedRows > 0;
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};

exports.updateUser = async (username, update) => {
  try {
    if ("total_score" in update && typeof update.total_score !== "number") {
      return Promise.reject({
        status: 400,
        msg: "Invalid input",
      });
    }
    if ("avatar" in update && typeof update.avatar !== "string") {
      return Promise.reject({
        status: 400,
        msg: "Invalid input",
      });
    }
    if (Object.keys(update).length > 0) {
      const setClause = Object.keys(update)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(update);
    values.push(username);
    const [updateResult] = await pool.query(
      `UPDATE UserAccount SET ${setClause} WHERE username = ?`,
      values
    );
    }
    
    const [updatedUser] = await pool.query(
      "SELECT * FROM UserAccount WHERE username = ?",
      [username]
    );

    updatedUser[0].total_score = Number(updatedUser[0].total_score);
    return updatedUser[0];
  } catch (error) {
    throw error;
  }
};

exports.loginUser = async (credentials) => {
  const { username, password } = credentials;
  if (!username || !password) {
    return Promise.reject({
      status: 400,
      msg: "Invalid input",
    });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM UserAccount WHERE username = ?",
      [username]
    );
    const user = rows[0];
    if (!user) {
      return Promise.reject({
        status: 404,
        msg: "Invalid username",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return Promise.reject({
        status: 404,
        msg: "Invalid password",
      });
    }

    const token = jwt.sign({ userId: user.username }, secretKey, {
      expiresIn: "4h",
    });
    return { token, user };
  } catch (error) {
    throw error;
  }
};
