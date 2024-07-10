const { seedDatabase } = require("../db/seed");
const pool = require("../db/connection");
const bcrypt = require("bcrypt");

jest.mock("../db/connection", () => {
  return {
    getConnection: jest.fn().mockResolvedValue({
      query: jest.fn(),
      release: jest.fn(),
    }),
  };
});

describe("Database Seeding", () => {
  let connection;

  beforeAll(async () => {
    connection = await pool.getConnection();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test("seeds the database correctly", async () => {
    connection.query.mockImplementation(async (sql) => {
      if (sql.includes("DROP TABLE")) return Promise.resolve();
      if (sql.includes("CREATE TABLE")) return Promise.resolve();
      if (sql.includes("INSERT INTO UserAccount")) return Promise.resolve();
      if (sql.includes("INSERT INTO UserCollection")) return Promise.resolve();
    });

    await seedDatabase();

    expect(connection.query).toHaveBeenCalledWith(
      "DROP TABLE IF EXISTS UserCollection;"
    );
    expect(connection.query).toHaveBeenCalledWith(
      "DROP TABLE IF EXISTS UserAccount;"
    );
    expect(connection.query).toHaveBeenCalledWith(
      expect.stringContaining("CREATE TABLE IF NOT EXISTS UserAccount")
    );
    expect(connection.query).toHaveBeenCalledWith(
      expect.stringContaining("CREATE TABLE IF NOT EXISTS UserCollection")
    );

    expect(connection.query).toHaveBeenCalledWith(
      expect.stringContaining(
        "INSERT INTO UserAccount (username, name, email, password, avatar)"
      ),
      expect.arrayContaining([
        "Yusha",
        "Yusha Rooshenas",
        "yusha@hotmail.com",
        expect.any(String),
        "https://upload.wikimedia.org/wikipedia/en/5/53/Scooby-Doo.png",
      ])
    );

    expect(connection.query).toHaveBeenCalledWith(
      expect.stringContaining(
        "INSERT INTO UserCollection (username, speciesID, speciesName, geoTag, matchScore, image, speciesFamily)"
      ),
      expect.arrayContaining([
        "Yusha",
        1,
        "Rose",
        expect.any(String),
        "0.23",
        "https://upload.wikimedia.org/wikipedia/commons/1/1f/A_close-up_of_climbing_roses.jpg",
        "Rosaceae",
      ])
    );

    expect(connection.release).toHaveBeenCalled();
  });

  test("handles errors gracefully", async () => {
    connection.query.mockImplementation(async () => {
      throw new Error("Database error");
    });

    await expect(seedDatabase()).rejects.toThrow("Database error");
    expect(connection.release).toHaveBeenCalled();
  });
});
