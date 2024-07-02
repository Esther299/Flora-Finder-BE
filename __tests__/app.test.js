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
  test("GET:200 sends a single user to the client", () => {
    return request(app)
      .get("/api/users/testuser1")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual(
          expect.objectContaining({
            username: "testuser1",
            name: "Test User 1",
            email: "test1@example.com",
            password: "hash123",
            avatar: "avatar1.png",
          })
        );
      });
  });
  test("GET:404 sends an appropriate status and error message when given a non-existent username", () => {
    return request(app)
      .get("/api/users/not-a-user")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});

describe("POST /api/users", () => {
  test("POST:201 inserts a new user to the db and sends the new user back to the client", () => {
    const newUser = {
      username: "testuser3",
      name: "Test User 3",
      email: "test3@example.com",
      password: "hash123",
    };
    return request(app)
      .post("/api/users/")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        const { user } = body;
        expect(user.username).toBe("testuser3");
        expect(user.name).toBe("Test User 3");
        expect(user.email).toBe("test3@example.com");
        expect(user.password).toBe("hash123");
        expect(user.avatar).toBe(
          "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
        );
      });
  });
  test("POST:201 inserts a new user even with extra properties in the request body", () => {
    const newUser = {
      username: "testuser3",
      name: "Test User 3",
      email: "test3@example.com",
      password: "hash123",
      extraProperty: 2,
    };
    return request(app)
      .post("/api/users/")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        const { user } = body;
        expect(user.username).toBe("testuser3");
        expect(user.name).toBe("Test User 3");
        expect(user.email).toBe("test3@example.com");
        expect(user.password).toBe("hash123");
        expect(user.avatar).toBe(
          "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
        );
      });
  });
  test("POST:400 sends an appropriate status and error message when provided with a bad user (no user body)", () => {
    return request(app)
      .post("/api/users/")
      .send({
        username: "testuser3",
        name: "Test User 3",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("POST:400 sends an appropriate status and error message when provided with invalid property type", () => {
    const newUser = {
      username: "testuser3",
      name: "Test User 3",
      email: "test1@example.com",
      password: 3,
    };
    return request(app)
      .post("/api/users/")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST:400 sends an appropriate status and error message when provided with invalid property types", () => {
    const newUser = {
      username: "testuser3",
      name: 2,
      email: "test1@example.com",
      password: "hash123",
    };
    return request(app)
      .post("/api/users/")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST:400 sends an appropriate status and error message when trying to post an existing username", () => {
    const newUser = {
      username: "testuser1",
      name: "Test User 3",
      email: "test1@example.com",
      password: "hash123",
    };
    return request(app)
      .post("/api/users/")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("User already exists");
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
        expect(Array.isArray(collections)).toBe(true);
        collections.forEach((collection) => {
          expect(collection).toMatchObject({
            uniqueSerialID: expect.any(String),
            username: "testuser1",
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
  test("GET:200 sends an empty array to the client when there are no collections for that user", () => {
    return request(app)
      .get("/api/users/testuser2/collections")
      .expect(200)
      .then(({ body }) => {
        const { collections } = body;
        expect(collections).toHaveLength(0);
        expect(collections).toEqual([]);
      });
  });
  test("GET:404 sends an appropriate status and error message when given a non-existent username", () => {
    return request(app)
      .get("/api/users/not-a-user/collections")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});

describe("POST /api/users/:username/collections", () => {
  test("POST:201 adds a new collection for the specified user and sends that collection back to the client", () => {
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
        expect(collection.uniqueSerialID).toBe("unique-id-456");
        expect(collection.speciesID).toBe(2);
        expect(collection.speciesName).toBe("Tulip");
        expect(collection.geoTag).toBe("geo-tag-2");
        expect(collection.matchScore).toBe(88.5);
        expect(collection.dateCollected).toBe("2024-07-01 19:10:26");
        expect(collection.image).toBe("image-url-2");
        expect(collection.speciesFamily).toBe("Liliaceae");
      });
  });
  test("POST:201 adds a new collection for the specified user even with extra properties in the request body", () => {
    const newCollection = {
      uniqueSerialID: "unique-id-456",
      speciesID: 2,
      speciesName: "Tulip",
      geoTag: "geo-tag-2",
      matchScore: 88.5,
      dateCollected: "2024-07-01 19:10:26",
      image: "image-url-2",
      speciesFamily: "Liliaceae",
      extraProperty: 2,
    };
    return request(app)
      .post("/api/users/testuser1/collections")
      .send(newCollection)
      .expect(201)
      .then(({ body }) => {
        const { collection } = body;
        expect(collection.uniqueSerialID).toBe("unique-id-456");
        expect(collection.speciesID).toBe(2);
        expect(collection.speciesName).toBe("Tulip");
        expect(collection.geoTag).toBe("geo-tag-2");
        expect(collection.matchScore).toBe(88.5);
        expect(collection.dateCollected).toBe("2024-07-01 19:10:26");
        expect(collection.image).toBe("image-url-2");
        expect(collection.speciesFamily).toBe("Liliaceae");
      });
  });
  test("POST:400 sends an appropriate status and error message when provided with a bad collection (no collection body)", () => {
    return request(app)
      .post("/api/users/testuser1/collections")
      .send({
        uniqueSerialID: "unique-id-456",
        speciesID: 2,
        speciesName: "Tulip",
        geoTag: "geo-tag-2",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("POST:400 sends an appropriate status and error message when provided with invalid property types", () => {
    const newCollection = {
      uniqueSerialID: "unique-id-456",
      speciesID: 2,
      speciesName: "Tulip",
      geoTag: 123,
      matchScore: 88.5,
      dateCollected: "2024-07-01 19:10:26",
      image: "image-url-2",
      speciesFamily: "Liliaceae",
      extraProperty: 2,
    };
    return request(app)
      .post("/api/users/testuser1/collections")
      .send(newCollection)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST:400 sends an appropriate status and error message when provided with invalid property types", () => {
    const newCollection = {
      uniqueSerialID: "unique-id-456",
      speciesID: "Hello",
      speciesName: "Tulip",
      geoTag: "geo-tag-2",
      matchScore: 88.5,
      dateCollected: "2024-07-01 19:10:26",
      image: "image-url-2",
      speciesFamily: "Liliaceae",
      extraProperty: 2,
    };
    return request(app)
      .post("/api/users/testuser1/collections")
      .send(newCollection)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST:404 sends an appropriate status and error message when given a non-existent user id", () => {
    const newCollection = {
      uniqueSerialID: "unique-id-456",
      speciesID: 2,
      speciesName: "Tulip",
      geoTag: "geo-tag-2",
      matchScore: 88.5,
      dateCollected: "2024-07-01 19:10:26",
      image: "image-url-2",
      speciesFamily: "Liliaceae",
      extraProperty: 2,
    };
    return request(app)
      .post("/api/users/not-a-user/collections")
      .send(newCollection)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
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
        expect(collection.speciesName).toBe("Updated Rose");
        expect(collection.matchScore).toBe(99.9);
      });
  });
  test("PATCH:200 updates only the matchScore of a collection for the specified user", () => {
    const updates = {
      matchScore: 50,
    };
    return request(app)
      .patch("/api/users/testuser1/collections/unique-id-123")
      .send(updates)
      .expect(200)
      .then(({ body }) => {
        const { collection } = body;
        expect(collection.matchScore).toBe(50);
      });
  });
  test("PATCH:200 updates only the speciesName of a collection for the specified user", () => {
    const updates = {
      speciesName: "New Flower",
    };
    return request(app)
      .patch("/api/users/testuser1/collections/unique-id-123")
      .send(updates)
      .expect(200)
      .then(({ body }) => {
        const { collection } = body;
        expect(collection.speciesName).toBe("New Flower");
        expect(collection.matchScore).toBe(98.5);
      });
  });
  test("PATCH:200 does not update any properties if the request body is empty", () => {
    return request(app)
      .patch("/api/users/testuser1/collections/unique-id-123")
      .send({})
      .expect(200)
      .then(({ body }) => {
        const { collection } = body;
        expect(collection.speciesName).toBe("Rose");
        expect(collection.matchScore).toBe(98.5);
      });
  });
  test("PATCH:400 sends an appropriate status and error message when the provided update properties are incorrect", () => {
    const updates = {
      unknownProperty: "Invalid Value",
    };
    return request(app)
      .patch("/api/users/testuser1/collections/unique-id-123")
      .send(updates)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("PATCH:400 sends an appropriate status and error message when the provided matchScore value is incorrect", () => {
    const updates = {
      matchScore: "banana",
    };
    return request(app)
      .patch("/api/users/testuser1/collections/unique-id-123")
      .send(updates)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("PATCH:404 sends an appropriate status and error message when given a non-existent collection", () => {
    const updates = {
      speciesName: "Updated Rose",
      matchScore: 99.9,
    };
    return request(app)
      .patch("/api/users/testuser/collections/not-a-collection")
      .send(updates)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Collection not found");
      });
  });
});

describe("DELETE /api/users/:username/collections/:collectionId", () => {
  test("DELETE:204 deletes a collection for the specified user", () => {
    return request(app)
      .delete("/api/users/testuser1/collections/unique-id-123")
      .expect(204);
  });
  test("DELETE:404 responds with an appropriate status and error message when given a non-existent id", () => {
    return request(app)
      .delete("/api/users/testuser1/collections/not-a-collection")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Collection not found");
      });
  });
});

describe("DELETE /api/users/:username", () => {
  test("DELETE:204 deletes a user", () => {
    return request(app).delete("/api/users/testuser1").expect(204);
  });
  test("DELETE:404 responds with an appropriate status and error message when given a non-existent username", () => {
    return request(app)
      .delete("/api/users/not-a-user")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});
