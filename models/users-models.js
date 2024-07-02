const pool = require("../db/connection");

exports.selectAllUsers = () => {
  return pool
    .query(
      "SELECT username, name, email, password, dateStamp, avatar FROM UserAccount;"
    )
    .then((result) => {
      return result[0];
    });
};

exports.selectUserById = async (username) => {
  try {
    console.log(`Querying database for user: ${username}`);
    const [rows] = await pool.query(
      "SELECT username, name, email, password, dateStamp, avatar FROM UserAccount WHERE username = ?",
      [username]
    );
    console.log(`Query result: ${JSON.stringify(rows)}`);
    return rows[0];
  } catch (error) {
    console.log(`Error querying database: ${error}`);
    throw error;
  }
};

exports.selectUserCollections = async (username) => {
  try {
    console.log(`Querying database for collections of user: ${username}`);
    const [rows] = await pool.query(
      "SELECT uniqueSerialID, speciesID, speciesName, geoTag, matchScore, dateCollected, image, speciesFamily FROM UserCollection WHERE username = ?",
      [username]
    );
    console.log(`Query result: ${JSON.stringify(rows)}`);
    rows.forEach((row) => {
      row.matchScore = Number(row.matchScore);
    });
    return rows;
  } catch (error) {
    console.log(`Error querying database: ${error}`);
    throw error;
  }
};

exports.insertUserCollection = async (username, newCollection) => {
  try {
    const {
      uniqueSerialID,
      speciesID,
      speciesName,
      geoTag,
      matchScore,
      dateCollected,
      image,
      speciesFamily,
    } = newCollection;
    await pool.query(
      `INSERT INTO UserCollection (uniqueSerialID, username, speciesID, speciesName, geoTag, matchScore, dateCollected, image, speciesFamily)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uniqueSerialID,
        username,
        speciesID,
        speciesName,
        geoTag,
        Number(matchScore),
        dateCollected,
        image,
        speciesFamily,
      ]
    );
    const [rows] = await pool.query(
      "SELECT uniqueSerialID, speciesID, speciesName, geoTag, matchScore, dateCollected, image, speciesFamily FROM UserCollection WHERE uniqueSerialID = ?",
      [uniqueSerialID]
    );

    rows[0].matchScore = Number(rows[0].matchScore);
    return rows[0];
  } catch (error) {
    console.log(`Error inserting collection: ${error}`);
    throw error;
  }
};

exports.updateCollection = async (username, collectionId, updates) => {
  try {
    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updates), username, collectionId];
    const [result] = await pool.query(
      `UPDATE UserCollection SET ${setClause} WHERE username = ? AND uniqueSerialID = ?`,
      values
    );
    console.log(`Update result: ${JSON.stringify(result)}`);
    const [updatedCollection] = await pool.query(
      "SELECT uniqueSerialID, speciesID, speciesName, geoTag, matchScore, dateCollected, image, speciesFamily FROM UserCollection WHERE username = ? AND uniqueSerialID = ?",
      [username, collectionId]
    );
    if (updatedCollection.length > 0) {
      updatedCollection[0].matchScore = Number(updatedCollection[0].matchScore);
      return updatedCollection[0];
    } else {
      return null;
    }
  } catch (error) {
    console.log(`Error updating collection: ${error}`);
    throw error;
  }
};

exports.deleteCollection = async (username, collectionId) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM UserCollection WHERE username = ? AND uniqueSerialID = ?",
      [username, collectionId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.log(`Error deleting collection: ${error}`);
    throw error;
  }
};

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
    console.log(`Error deleting user: ${error}`);
    throw error;
  }
};
