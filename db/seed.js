const pool = require("./connection");
const bcrypt = require("bcrypt");
const { seedUsers, seedCollections } = require("./data/dev-data");

async function seedDatabase() {
  try {
    const connection = await pool.getConnection();
    await connection.query("DROP TABLE IF EXISTS UserCollection;");
    await connection.query("DROP TABLE IF EXISTS UserAccount;");
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS UserAccount (
        username VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        dateStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        avatar VARCHAR(255),
        total_score INT DEFAULT 0
      );
    `;
    const createCollectionsTable = `
      CREATE TABLE IF NOT EXISTS UserCollection (
        plantId INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        speciesID INT NOT NULL,
        speciesName VARCHAR(255) NOT NULL,
        geoTag VARCHAR(255),
        matchScore DECIMAL(5,2),
        dateCollected TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        image VARCHAR(255) NOT NULL,
        speciesFamily VARCHAR(255) NOT NULL,
        FOREIGN KEY (username) REFERENCES UserAccount(username)
      );
    `;

    await connection.query(createUsersTable);
    await connection.query(createCollectionsTable);

    const insertUserQuery = `
      INSERT INTO UserAccount (username, name, email, password, avatar)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), password = VALUES(password), avatar = VALUES(avatar);
    `;

    for (const user of seedUsers) {
        await connection.query(insertUserQuery, [
        user.username,
        user.name,
        user.email,
        user.password,
        user.avatar,
      ]);
      
    }

    const insertCollectionQuery = `
      INSERT INTO UserCollection (username, speciesID, speciesName, geoTag, matchScore, image, speciesFamily)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE speciesName = VALUES(speciesName), geoTag = VALUES(geoTag), matchScore = VALUES(matchScore), dateCollected = VALUES(dateCollected), image = VALUES(image), speciesFamily = VALUES(speciesFamily);
    `;

    for (const collection of seedCollections) {
      await connection.query(insertCollectionQuery, [
        collection.username,
        collection.speciesID,
        collection.speciesName,
        collection.geoTag,
        collection.matchScore,
        collection.image,
        collection.speciesFamily,
      ]);
    }

    console.log("Database seeding completed successfully!");
    connection.release();
  } catch (error) {
    console.error("Error seeding the database:", error);
    throw error;
  }
}

module.exports = { seedDatabase };
