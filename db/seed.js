const pool = require("./connection");
const bcrypt = require("bcrypt");

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

    const seedUsers = [
      {
        username: "Yusha",
        name: "Yusha Rooshenas",
        email: "yusha@hotmail.com",
        password: bcrypt.hashSync("FloraSquad5", 10),
        avatar: "https://upload.wikimedia.org/wikipedia/en/5/53/Scooby-Doo.png",
      },
      {
        username: "James",
        name: "James Wallace",
        email: "james@gmail.com",
        password: bcrypt.hashSync("FloraSquad5", 10),
        avatar:
          "https://upload.wikimedia.org/wikipedia/en/8/87/ShaggyRogers.png",
      },
      {
        username: "Esther",
        name: "Esther Gines",
        email: "esther@yahoo.com",
        password: bcrypt.hashSync("FloraSquad5", 10),
        avatar:
          "https://upload.wikimedia.org/wikipedia/en/9/9d/Velma_Dinkley.png",
      },
      {
        username: "Alex",
        name: "Alex Hughes",
        email: "alex@googlemail.com",
        password: bcrypt.hashSync("FloraSquad5", 10),
        avatar: "https://upload.wikimedia.org/wikipedia/en/4/47/Fred_Jones.png",
      },
      {
        username: "Kate",
        name: "Kate Blacklock",
        email: "kate@xataka.com",
        password: bcrypt.hashSync("FloraSquad5", 10),
        avatar:
          "https://upload.wikimedia.org/wikipedia/en/1/1d/Daphne_Blake.png",
      },
    ];

    const seedCollections = [
      {
        username: "Yusha",
        speciesID: 1,
        speciesName: "Rose",
        geoTag: "geo-tag-1",
        matchScore: "0.23",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/1/1f/A_close-up_of_climbing_roses.jpg",
        speciesFamily: "Rosaceae",
      },
      {
        username: "James",
        speciesID: 2,
        speciesName: "Tulip",
        geoTag: "geo-tag-2",
        matchScore: "0.67",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/c/c4/Tulipa_orphanidea_060506.jpg",
        speciesFamily: "Liliaceae",
      },
      {
        username: "Esther",
        speciesID: 3,
        speciesName: "Sunflower",
        geoTag: "geo-tag-3",
        matchScore: "0.45",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/4/40/Sunflower_sky_backdrop.jpg",
        speciesFamily: "Asteraceae",
      },
      {
        username: "Alex",
        speciesID: 4,
        speciesName: "Daffodil",
        geoTag: "geo-tag-4",
        matchScore: "0.12",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/9/96/A_Perfect_Pair_Daffodills_%28Narcissus%29_-_8.jpg",
        speciesFamily: "Amaryllidaceae",
      },
      {
        username: "Kate",
        speciesID: 5,
        speciesName: "Lily",
        geoTag: "geo-tag-5",
        matchScore: "0.65",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/e/e7/Lilium_Golden_Splendour3.jpg",
        speciesFamily: "Liliaceae",
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
  }
}

module.exports = { seedDatabase };
