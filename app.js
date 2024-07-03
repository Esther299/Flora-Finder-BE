const express = require("express");
const {
  getUsers,
  getUserById,
  addUser,
  deleteUserByUsername,
} = require("./controllers/users-controllers");
const {
  getUserCollections,
  addUserCollection,
  updateUserCollection,
  deleteUserCollection,
} = require("./controllers/collection-controllers");

const app = express();
app.use(express.json());

// Define routes with logging
app.get("/api/users", (req, res, next) => {
  console.log("GET /api/users");
  getUsers(req, res, next);
});

app.get("/api/users/:username", (req, res, next) => {
  console.log(`GET /api/users/${req.params.username}`);
  getUserById(req, res, next);
});

app.post("/api/users", (req, res, next) => {
  console.log(`POST /api/users/${req.params.username}`);
  addUser(req, res, next);
});

app.get("/api/users/:username/collections", (req, res, next) => {
  console.log(`GET /api/users/${req.params.username}/collections`);
  getUserCollections(req, res, next);
});

app.post("/api/users/:username/collections", (req, res, next) => {
  console.log(`POST /api/users/${req.params.username}/collections`);
  addUserCollection(req, res, next);
});

app.patch(
  "/api/users/:username/collections/:collectionId",
  (req, res, next) => {
    console.log(
      `PATCH /api/users/${req.params.username}/collections/${req.params.collectionId}`
    );
    updateUserCollection(req, res, next);
  }
);

app.delete(
  "/api/users/:username/collections/:collectionId",
  (req, res, next) => {
    console.log(
      `DELETE /api/users/${req.params.username}/collections/${req.params.collectionId}`
    );
    deleteUserCollection(req, res, next);
  }
);

app.delete("/api/users/:username", (req, res, next) => {
  console.log(`DELETE /api/users/${req.params.username}`);
  deleteUserByUsername(req, res, next);
});

// Handle unknown routes
app.all("*", (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).send({ msg: "Route not found" });
});

// Error handling middleware with logging
app.use((err, req, res, next) => {
  console.error("SQL Error Handler:", err);
  if (err.sqlState === "42S22") {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error("General Error Handler:", err);
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).send({ error: "An unexpected error occurred" });
});

// Start the server and log the port
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
