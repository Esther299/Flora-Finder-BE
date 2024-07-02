const express = require("express");
const {
  getUsers,
  getUserById,
  getUserCollections,
  addUserCollection,
  updateUserCollection,
  deleteUserCollection,
  deleteUserByUsername,
} = require("./controllers/users-controllers");

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

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ error: "An unexpected error occurred" });
});

module.exports = app;
