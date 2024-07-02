const pool = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const { seedDatabase, deleteDatabase } = require("../db/seed");

beforeEach(async () => {
  await deleteDatabase();
  await seedDatabase();
});

afterAll(async () => {
  await deleteDatabase();
  await pool.end();
});

describe("GET /api/users", () => {
  test("GET:200 sends an array of users to the client, each of which should have the properties of username, name, email, password, dateStamp, and avatar", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        console.log(users);
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(2);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            email: expect.any(String),
            password: expect.any(String),
            dateStamp: expect.any(String),
            avatar: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("GET:200 sends a user object with the properties of username, name, email, password, dateStamp, and avatar", () => {
    return request(app)
      .get("/api/users/testuser1")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        console.log(`Received user: ${JSON.stringify(user)}`); // Debugging line
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
          dateStamp: expect.any(String),
          avatar: expect.any(String),
        });
      });
  });
});

describe("GET /api/users/:username/collections", () => {
  test("GET:200 sends an array of collections for the specified user", () => {
    return request(app)
      .get("/api/users/testuser1/collections")
      .expect(200)
      .then(({ body }) => {
        const { collections } = body;
        console.log(collections);
        expect(Array.isArray(collections)).toBe(true);
        collections.forEach((collection) => {
          expect(collection).toMatchObject({
            uniqueSerialID: expect.any(String),
            speciesID: expect.any(Number),
            speciesName: expect.any(String),
            geoTag: expect.any(String),
            matchScore: expect.any(Number),
            dateCollected: expect.any(String),
            image: expect.any(String),
            speciesFamily: expect.any(String),
          });
        });
      });
  });
});

describe("POST /api/users/:username/collections", () => {
  test("POST:201 adds a new collection for the specified user", () => {
    const newCollection = {
      uniqueSerialID: "unique-id-456",
      speciesID: 2,
      speciesName: "Tulip",
      geoTag: "geo-tag-2",
      matchScore: 88.5,
      dateCollected: "2024-07-01 19:10:26",
      image: "image-url-2",
      speciesFamily: "Liliaceae",
    };
    return request(app)
      .post("/api/users/testuser1/collections")
      .send(newCollection)
      .expect(201)
      .then(({ body }) => {
        const { collection } = body;
        console.log(collection);
        expect(collection).toMatchObject({
          uniqueSerialID: expect.any(String),
          speciesID: expect.any(Number),
          speciesName: expect.any(String),
          geoTag: expect.any(String),
          matchScore: expect.any(Number),
          dateCollected: expect.any(String),
          image: expect.any(String),
          speciesFamily: expect.any(String),
        });
      });
  });
});

describe("PATCH /api/users/:username/collections/:collectionId", () => {
  test("PATCH:200 updates a collection for the specified user", () => {
    const updates = {
      speciesName: "Updated Rose",
      matchScore: 99.9,
    };
    return request(app)
      .patch("/api/users/testuser1/collections/unique-id-123")
      .send(updates)
      .expect(200)
      .then(({ body }) => {
        const { collection } = body;
        console.log(collection);
        expect(collection).toMatchObject({
          speciesName: "Updated Rose",
          matchScore: 99.9,
        });
      });
  });
});
describe("DELETE /api/users/:username/collections/:collectionId", () => {
  test("DELETE:204 deletes a collection for the specified user", () => {
    return request(app)
      .delete("/api/users/testuser1/collections/unique-id-123")
      .expect(204);
  });
});

describe("DELETE /api/users/:username", () => {
  test("DELETE:204 deletes a user", () => {
    return request(app).delete("/api/users/testuser1").expect(204);
  });
});
