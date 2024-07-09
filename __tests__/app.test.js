const pool = require("../db/connection");
const app = require("../app");
const request = require("supertest");
require("jest-sorted");
const { seedDatabase } = require("../db/seed");
const endpointsFile = require("../endpoint.json");

beforeEach(async () => {
  await seedDatabase();
});

afterAll(async () => {
  await pool.end();
});

describe("GET api", () => {
  test("GET:200 sends an object describing all the available endpoints on your API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpointsData } = body;
        expect(endpointsData).toEqual(endpointsFile);
      });
  });
});

describe("GET /api/users", () => {
  test("GET:200 sends an array of users to the client, each of which should have the properties of username, name, email, password, dateStamp, and avatar", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(5);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            email: expect.any(String),
            password: expect.any(String),
            dateStamp: expect.any(String),
            avatar: expect.any(String),
            total_score: expect.any(Number),
          });
        });
      });
  });
  test("GET:200 sends an array of users sorted by total_score in descending order by default", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeSortedBy("total_score", { descending: true });
      });
  });
  test("GET:200 sends an array of users sorted by total_score in ascending order when query param 'order=asc' is passed", () => {
    return request(app)
      .get("/api/users?order=asc")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeSortedBy("total_score", { ascending: true });
      });
  });
  test("GET:200 sends an array of users sorted by total_score in descending order when query param 'order=desc' is passed", () => {
    return request(app)
      .get("/api/users?order=desc")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeSortedBy("total_score", { descending: true });
      });
  });
  test("GET:400 sends an error message when an invalid order query param is passed", () => {
    return request(app)
      .get("/api/users?order=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad query request");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("GET:200 sends a single user to the client", () => {
    return request(app)
      .get("/api/users/Esther")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual(
          expect.objectContaining({
            username: "Esther",
            name: "Esther Gines",
            email: "esther@yahoo.com",
            password: expect.stringMatching(/^\$2b\$10\$[\s\S]{53}$/),
            dateStamp: expect.any(String),
            avatar:
              "https://upload.wikimedia.org/wikipedia/en/9/9d/Velma_Dinkley.png",
            total_score: 0,
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
      password: "password123",
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
        expect(user).toHaveProperty("password");
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
      password: "password123",
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
        expect(user).toHaveProperty("password");
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
      username: "Esther",
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

describe("DELETE /api/users/:username", () => {
  test("DELETE:204 deletes a user", () => {
    return request(app).delete("/api/users/Esther").expect(204);
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

describe("GET /api/users/:username/collections", () => {
  test("GET:200 sends an array of collections for the specified user", () => {
    return request(app)
      .get("/api/users/Esther/collections")
      .expect(200)
      .then(({ body }) => {
        const { collections } = body;
        expect(Array.isArray(collections)).toBe(true);
        collections.forEach((collection) => {
          expect(collection).toMatchObject({
            plantId: expect.any(Number),
            username: "Esther",
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
  xtest("GET:200 sends an empty array to the client when there are no collections for that user", () => {
    return request(app)
      .get("/api/users/Alex/collections")
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
  test("POST:201 adds a new plant for the specified user and sends that collection back to the client", () => {
    const newCollection = {
      speciesID: 3,
      speciesName: "Tulip",
      geoTag: "geo-tag-2",
      matchScore: 88.5,
      image: "image-url-2",
      speciesFamily: "Liliaceae",
    };
    return request(app)
      .post("/api/users/Esther/collections")
      .send(newCollection)
      .expect(201)
      .then(({ body }) => {
        const { collection } = body;
        expect(typeof collection.plantId).toBe("number");
        expect(collection.speciesID).toBe(3);
        expect(collection.speciesName).toBe("Tulip");
        expect(collection.geoTag).toBe("geo-tag-2");
        expect(collection.matchScore).toBe(88.5);
        expect(typeof collection.dateCollected).toBe("string");
        expect(collection.image).toBe("image-url-2");
        expect(collection.speciesFamily).toBe("Liliaceae");
      });
  });
  test("POST:201 adds a new collection for the specified user even with extra properties in the request body", () => {
    const newCollection = {
      speciesID: 2,
      speciesName: "Tulip",
      geoTag: "geo-tag-2",
      matchScore: 88.5,
      image: "image-url-2",
      speciesFamily: "Liliaceae",
      extraProperty: 2,
    };
    return request(app)
      .post("/api/users/Esther/collections")
      .send(newCollection)
      .expect(201)
      .then(({ body }) => {
        const { collection } = body;
        expect(typeof collection.plantId).toBe("number");
        expect(collection.speciesID).toBe(2);
        expect(collection.speciesName).toBe("Tulip");
        expect(collection.geoTag).toBe("geo-tag-2");
        expect(collection.matchScore).toBe(88.5);
        expect(typeof collection.dateCollected).toBe("string");
        expect(collection.image).toBe("image-url-2");
        expect(collection.speciesFamily).toBe("Liliaceae");
      });
  });
  test("POST:400 sends an appropriate status and error message when provided with a bad collection (no collection body)", () => {
    return request(app)
      .post("/api/users/Esther/collections")
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
      .post("/api/users/Esther/collections")
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
      .post("/api/users/Esther/collections")
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

describe("DELETE /api/users/:username/collections/:collectionId", () => {
  test("DELETE:204 deletes a plant for the specified user", () => {
    return request(app)
      .delete("/api/users/Esther/collections/Sunflower")
      .expect(204);
  });
  test("DELETE:404 responds with an appropriate status and error message when given a valid but non-existent plant", () => {
    return request(app)
      .delete("/api/users/Esther/collections/not-a-plant")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Plant does not exist");
      });
  });
});

describe("PATCH /api/users/:username", () => {
  test("PATCH:200 updates the avatar and total_score for the specified user", () => {
    const update = {
      avatar:
        "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
      total_score: 20,
    };
    return request(app)
      .patch("/api/users/Esther")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user.avatar).toBe(
          "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953"
        );
        expect(user.total_score).toBe(20);
      });
  });
  test("PATCH:200 updates only the avatar for the specified user", () => {
    const update = {
      avatar:
        "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
    };
    return request(app)
      .patch("/api/users/Esther")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user.avatar).toBe(
          "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953"
        );
      });
  });
  test("PATCH:200 updates only the total_score for the specified user", () => {
    const update = {
      total_score: 20,
    };
    return request(app)
      .patch("/api/users/Esther")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user.total_score).toBe(20);
      });
  });
  test("PATCH:200 does not update any properties if the request body is empty", () => {
    return request(app)
      .patch("/api/users/Esther")
      .send({})
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user.avatar).toBe(
          "https://upload.wikimedia.org/wikipedia/en/9/9d/Velma_Dinkley.png"
        );
        expect(user.total_score).toBe(0);
      });
  });
  test("PATCH:400 sends an appropriate status and error message when the provided update properties are incorrect", () => {
    const update = {
      unknownProperty: "Invalid Value",
    };
    return request(app)
      .patch("/api/users/Esther")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("PATCH:400 sends an appropriate status and error message when the provided total_score value is incorrect", () => {
    const update = {
      total_score: "banana",
    };
    return request(app)
      .patch("/api/users/Esther")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("PATCH:400 sends an appropriate status and error message when the provided avatar value is incorrect", () => {
    const update = {
      avatar: 2,
    };
    return request(app)
      .patch("/api/users/Esther")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("PATCH:404 sends an appropriate status and error message when given a non-existent user", () => {
    const update = {
      avatar:
        "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
      total_score: 20,
    };
    return request(app)
      .patch("/api/users/not-a-user")
      .send(update)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});

describe("Authentication Endpoints", () => {
  let token;

  test("should register a new user", () => {
    return request(app)
      .post("/api/users")
      .send({
        username: "testuser3",
        name: "Test User 3",
        email: "testuser@example.com",
        password: "password789",
      })
      .expect(201)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toHaveProperty("username", "testuser3");
      });
  });

  test("should handle invalid input during user registration", () => {
    return request(app)
      .post("/api/users")
      .send({
        username: "testuser3",
        name: "Test User 3",
        email: "testuser3@example.com",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });

  test("should login the user and return a token", () => {
    return request(app)
      .post("/api/users/login")
      .send({
        username: "Esther",
        password: "FloraSquad5",
      })
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("token");
        token = body.token;
      });
  });

  test("should handle incorrect password during login", () => {
    return request(app)
      .post("/api/users/login")
      .send({
        username: "Esther",
        password: "wrongpassword",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid password");
      });
  });

  test("should handle incorrect username during login", () => {
    return request(app)
      .post("/api/users/login")
      .send({
        username: "not-a-user",
        password: "password123",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid username");
      });
  });

  test("should access the protected route with valid token", () => {
    return request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(({ text }) => {
        expect(text).toEqual("This is a protected route");
      });
  });

  test("should not access the protected route without token", () => {
    return request(app).get("/api/protected").expect(401);
  });

  test("should not access the protected route with expired token", () => {
    const expiredToken = "...";
    return request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${expiredToken}`)
      .expect(403);
  });

  test("should not access the protected route with invalid token format", () => {
    return request(app)
      .get("/api/protected")
      .set("Authorization", "InvalidTokenFormat")
      .expect(401);
  });
});
