const pool = require("./connection");

async function seedDatabase() {
  try {
    const connection = await pool.getConnection();
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS UserAccount (
        username VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        dateStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        avatar VARCHAR(255)
      );
    `;
    const createCollectionsTable = `
      CREATE TABLE IF NOT EXISTS UserCollection (
        uniqueSerialID VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        speciesID INT NOT NULL,
        speciesName VARCHAR(255) NOT NULL,
        geoTag VARCHAR(255) NOT NULL,
        matchScore DECIMAL(5, 2) DEFAULT 0,
        dateCollected TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        image VARCHAR(255) NOT NULL,
        speciesFamily VARCHAR(255) NOT NULL,
        FOREIGN KEY (username) REFERENCES UserAccount(username)
      );
    `;
    await connection.query(createUsersTable);
    await connection.query(createCollectionsTable);

    const seedUsers = [
      {
        username: "testuser1",
        name: "Test User 1",
        email: "test1@example.com",
        password: "hash123",
        avatar: "avatar1.png",
      },
      {
        username: "testuser2",
        name: "Test User 2",
        email: "test2@example.com",
        password: "hash456",
        avatar: "avatar2.png",
      },
    ];

    const seedCollections = [
      {
        uniqueSerialID: "unique-id-123",
        username: "testuser1",
        speciesID: 1,
        speciesName: "Rose",
        geoTag: "geo-tag-1",
        matchScore: 98.5,
        dateCollected: "2024-07-01 19:10:26",
        image: "image-url",
        speciesFamily: "Rosaceae",
      },
    ];

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
      INSERT INTO UserCollection (uniqueSerialID, username, speciesID, speciesName, geoTag, matchScore, dateCollected, image, speciesFamily)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE speciesName = VALUES(speciesName), geoTag = VALUES(geoTag), matchScore = VALUES(matchScore), dateCollected = VALUES(dateCollected), image = VALUES(image), speciesFamily = VALUES(speciesFamily);
    `;

    for (const collection of seedCollections) {
      await connection.query(insertCollectionQuery, [
        collection.uniqueSerialID,
        collection.username,
        collection.speciesID,
        collection.speciesName,
        collection.geoTag,
        collection.matchScore,
        collection.dateCollected,
        collection.image,
        collection.speciesFamily,
      ]);
    }

    //console.log("Database seeding completed successfully!");
    connection.release();
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
}

async function deleteDatabase() {
  try {
    const connection = await pool.getConnection();
    await connection.query("DROP TABLE IF EXISTS UserCollection");
    await connection.query("DROP TABLE IF EXISTS UserAccount");
    connection.release();
  } catch (error) {
    console.error("Error deleting the database:", error);
  }
}

module.exports = { seedDatabase, deleteDatabase };
