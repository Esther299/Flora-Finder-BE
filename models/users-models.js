const pool = require("../db/connection");

exports.selectAllUsers = async () => {
  try {
    //console.log(`Querying database for all users`);
    const [rows] = await pool.query(
      "SELECT username, name, email, password, dateStamp, avatar FROM UserAccount;"
    );
    //console.log(`Query result: ${JSON.stringify(rows)}`);
    return rows;
  } catch (error) {
    //console.log(`Error querying database: ${error}`);
    throw error;
  }
};

exports.selectUserById = async (username) => {
  try {
    //console.log(`Querying database for user: ${username}`);
    const [rows] = await pool.query(
      "SELECT username, name, email, password, dateStamp, avatar FROM UserAccount WHERE username = ?",
      [username]
    );
    //console.log(`Query result: ${JSON.stringify(rows)}`);
     if (!rows[0]) {
       throw { status: 404, msg: "User not found" };
     }
    return rows[0];
  } catch (error) {
    //console.log(`Error querying database: ${error}`);
    throw error;
  }
};

exports.checkUserExists = async (username) => {
  try {
    //console.log(`Querying database for user: ${username}`);
    const [rows] = await pool.query(
      "SELECT username, name, email, password, dateStamp, avatar FROM UserAccount WHERE username = ?",
      [username]
    );
    if (!rows[0]) {
      throw { status: 404, msg: "User not found" };
    }
  } catch (error) {
    //console.log(`Error querying database: ${error}`);
    throw error;
  }
}
exports.deleteUser = async (username) => {
  try {
    //  actions are grouped all or nothing
    await pool.query("START TRANSACTION");

    //  get rid of the suers collections
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
    //console.log(`Error deleting user: ${error}`);
    throw error;
  }
};
