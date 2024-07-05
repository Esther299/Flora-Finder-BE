const pool = require("../db/connection");
const moment = require("moment");

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
    const [rows] = await pool.query(
      `SELECT * FROM UserAccount ORDER BY total_score ${orderDirection};`
    );
    rows.forEach((row) => {
      row.dateCollected = moment(row.dateCollected).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    });
    return rows;
  } catch (error) {
    throw error;
  }
};

exports.selectUserById = async (username) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM UserAccount WHERE username = ?",
      [username]
    );
    if (!rows[0]) {
      throw { status: 404, msg: "User not found" };
    }
    rows[0].dateCollected = moment(rows[0].dateCollected).format(
      "YYYY-MM-DD HH:mm:ss"
    );
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
      password,
      defaultAvatar,
    ]);
    const [rows] = await pool.query(
      "SELECT * FROM UserAccount WHERE username = ?",
      [username]
    );

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
