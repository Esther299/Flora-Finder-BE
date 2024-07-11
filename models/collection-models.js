const pool = require("../db/connection");
const moment = require("moment");
const { updateTotalScore } = require("./updateTotalScore");
exports.selectAllCollections = async () => {
  try {
    const query = "SELECT * FROM UserCollection";
    const [rows] = await pool.query(query);
    return rows;
  } catch {
    throw error;
  }
};
exports.selectUserCollections = async (username, options = {}) => {
  const { speciesFamily, sortBy, orderBy } = options;

  let orderByClause = "ORDER BY dateCollected DESC";

  if (!sortBy && orderBy) {
    orderByClause = `ORDER BY dateCollected ${orderBy.toUpperCase()}`;
  }
  if (sortBy) {
    let orderDirection = "DESC";
    if (orderBy && orderBy.toUpperCase() === "ASC") {
      orderDirection = "ASC";
    }
    orderByClause = `ORDER BY ${sortBy} ${orderDirection}`;
  }

  const queryParams = [username];
  let query = "SELECT * FROM UserCollection WHERE username = ?";

  if (speciesFamily) {
    query += " AND speciesFamily = ?";
    queryParams.push(speciesFamily);
  }

  query += ` ${orderByClause}`;

  try {
    const [rows] = await pool.query(query, queryParams);

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

exports.checkCollectionExists = async (username, plantId) => {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS count FROM UserCollection WHERE username = ? AND plantId = ?",
      [username, plantId]
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
      "SELECT *, (SELECT COALESCE(SUM(matchScore), 0) FROM UserCollection WHERE username = ?) AS total_score FROM UserCollection WHERE plantId = LAST_INSERT_ID()",
      [username]
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

exports.deleteCollection = async (username, plantId) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM UserCollection WHERE username = ? AND plantId = ?",
      [username, plantId]
    );
    await updateTotalScore(username);
    return true;
  } catch (error) {
    throw error;
  }
};
