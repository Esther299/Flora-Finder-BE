const pool = require("../db/connection");

exports.selectUserCollections = async (username) => {
  try {
    //console.log(`Querying database for collections of user: ${username}`);
    const [rows] = await pool.query(
      "SELECT uniqueSerialID, username, speciesID, speciesName, geoTag, matchScore, dateCollected, image, speciesFamily FROM UserCollection WHERE username = ?",
      [username]
    );
    //console.log(`Query result: ${JSON.stringify(rows)}`);
    rows.forEach((row) => {
      row.matchScore = Number(row.matchScore);
    });
    return rows;
  } catch (error) {
    //console.log(`Error querying database: ${error}`);
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
    uniqueSerialID: "string",
    speciesID: "number",
    speciesName: "string",
    geoTag: "string",
    matchScore: "number",
    dateCollected: "string",
    image: "string",
    speciesFamily: "string",
    extraProperty: "number",
  };
  for (const key in expectedTypes) {
    if (
      newCollection[key] !== undefined &&
      typeof newCollection[key] !== expectedTypes[key]
    ) {
      return Promise.reject({
        status: 400,
        msg: 'Bad request',
      });
    }
  }

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
    //console.log(`Error inserting collection: ${error}`);
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
    //console.log(`Update result: ${JSON.stringify(result)}`);
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
    //console.log(`Error updating collection: ${error}`);
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
    //console.log(`Error deleting collection: ${error}`);
    throw error;
  }
};
