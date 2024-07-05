const pool = require("../db/connection");

exports.selectUserCollections = async (username) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM UserCollection WHERE username = ?",
      [username]
    );
    rows.forEach((row) => {
      row.matchScore = Number(row.matchScore);
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

    console.log(rows);
    rows[0].matchScore = Number(rows[0].matchScore);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// exports.updateCollection = async (username, collectionId, updates) => {
//   if ("matchScore" in updates && typeof updates.matchScore !== "number") {
//     throw { status: 400, msg: "Invalid input" };
//   }
//   try {
//     let result;
//     if (Object.keys(updates).length > 0) {
//       const setClause = Object.keys(updates)
//         .map((key) => `${key} = ?`)
//         .join(", ");
//       const values = [...Object.values(updates), username, collectionId];

//       const [updateResult] = await pool.query(
//         `UPDATE UserCollection SET ${setClause} WHERE username = ? AND uniqueSerialID = ?`,
//         values
//       );
//       result = updateResult;
//     }

//     const [updatedCollection] = await pool.query(
//       "SELECT uniqueSerialID, speciesID, speciesName, geoTag, matchScore, dateCollected, image, speciesFamily FROM UserCollection WHERE username = ? AND uniqueSerialID = ?",
//       [username, collectionId]
//     );

//     if (updatedCollection.length > 0) {
//       updatedCollection[0].matchScore = Number(updatedCollection[0].matchScore);
//       return updatedCollection[0];
//     } else {
//       return null;
//     }
//   } catch (error) {
//     throw error;
//   }
// };

exports.deleteCollection = async (username, speciesName) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM UserCollection WHERE username = ? AND speciesName = ?",
      [username, speciesName]
    );
    console.log(result)
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};
