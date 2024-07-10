const pool = require("../db/connection");
const { updateTotalScore } = require("../models/collection-models"); // Adjust the path to your module
const { seedDatabase } = require("../db/seed");

beforeEach(async () => {
  await seedDatabase();
});

afterAll(async () => {
  await pool.end();
});

describe("updateTotalScore", () => {
  test("correctly updates the total score when there are user collections", () => {
    const username = "Yusha";

    return pool
      .query(
        "INSERT INTO UserCollection (username, speciesID, speciesName, geoTag, matchScore, image, speciesFamily) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          username,
          1,
          "Rose",
          '{"latitude":51.5074,"longitude":-0.1278}',
          10,
          "image_url",
          "Rosaceae",
        ]
      )
      .then(() => {
        return updateTotalScore(username);
      })
      .then(() => {
        return pool.query(
          "SELECT total_score FROM UserAccount WHERE username = ?",
          [username]
        );
      })
      .then(([rows]) => {
        expect(rows[0].total_score).toBe(10);
      });
  });

  test("sets the total score to 0 if there are no user collections", () => {
    const username = "Saleh";

    return updateTotalScore(username)
      .then(() => {
        return pool.query(
          "SELECT total_score FROM UserAccount WHERE username = ?",
          [username]
        );
      })
      .then(([rows]) => {
        expect(rows[0].total_score).toBe(0);
      });
  });
});
