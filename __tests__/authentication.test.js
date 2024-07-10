const pool = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const { seedDatabase } = require("../db/seed");

beforeEach(async () => {
  await seedDatabase();
});

afterAll(async () => {
  await pool.end();
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
