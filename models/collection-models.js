const pool = require("../db/connection");
const moment = require("moment");

exports.selectUserCollections = async (username) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM UserCollection WHERE username = ?",
      [username]
    );
    rows.forEach((row) => {
      row.matchScore = Number(row.matchScore);
      row.dateCollected = moment(row.dateCollected).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    });
    return rows;
  } catch (error) {
    throw error;
  }
};

exports.checkCollectionExists = async (username, speciesName) => {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS count FROM UserCollection WHERE username = ? AND speciesName = ?",
      [username, speciesName]
    );
    const count = rows[0].count;
    if (count === 0) {
      return Promise.reject({ status: 404, msg: "Plant does not exist" });
    }
  } catch (error) {
    throw error;
  }
};

exports.insertUserCollection = async (username, newCollection) => {
  if (typeof newCollection !== "object" || newCollection === null) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }
  const expectedTypes = {
    speciesID: "number",
    speciesName: "string",
    geoTag: "string",
    matchScore: "number",
    image: "string",
    speciesFamily: "string",
  };
  for (const key in expectedTypes) {
    if (
      newCollection[key] !== undefined &&
      typeof newCollection[key] !== expectedTypes[key]
    ) {
      return Promise.reject({
        status: 400,
        msg: "Bad request",
      });
    }
  }
  try {
    const { speciesID, speciesName, geoTag, matchScore, image, speciesFamily } =
      newCollection;
    await pool.query(
      `INSERT INTO UserCollection ( username, speciesID, speciesName, geoTag, matchScore, image, speciesFamily)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        speciesID,
        speciesName,
        geoTag,
        Number(matchScore),
        image,
        speciesFamily,
      ]
    );
    const [rows] = await pool.query(
      "SELECT * FROM UserCollection WHERE plantId = LAST_INSERT_ID()"
    );
    rows[0].matchScore = Number(rows[0].matchScore);
    rows[0].dateCollected = moment(rows[0].dateCollected).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

exports.deleteCollection = async (username, speciesName) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM UserCollection WHERE username = ? AND speciesName = ?",
      [username, speciesName]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};
