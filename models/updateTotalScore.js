const pool = require("../db/connection");
const moment = require("moment");

exports.updateTotalScore = async (username) => {
  try {
    const [rows] = await pool.query(
      "SELECT COALESCE(SUM(matchScore), 0) AS totalScore FROM UserCollection WHERE username = ?",
      [username]
    );
    const totalScore = rows[0].totalScore || 0;

    await pool.query(
      "UPDATE UserAccount SET total_score = ? WHERE username = ?",
      [totalScore, username]
    );
  } catch (error) {
    throw error;
  }
};
