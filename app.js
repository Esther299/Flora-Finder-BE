const express = require("express");
const {
  getUsers,
  getUserById,
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

app.get("/api/users", getUsers);
app.get("/api/users/:username", getUserById);
app.get("/api/users/:username/collections", getUserCollections);
app.post("/api/users/:username/collections", addUserCollection);
app.patch(
  "/api/users/:username/collections/:collectionId",
  updateUserCollection
);
app.delete(
  "/api/users/:username/collections/:collectionId",
  deleteUserCollection
);
app.delete("/api/users/:username", deleteUserByUsername);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.sqlState === "42S22") {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ error: "An unexpected error occurred" });
});

module.exports = app;
