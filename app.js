const express = require("express");
const {
  getUsers,
  getUserById,
  addUser,
  deleteUserByUsername,
  authenticateUser,
} = require("./controllers/users-controllers");
const {
  getUserCollections,
  addUserCollection,
  deleteUserCollection,
} = require("./controllers/collection-controllers");
const { verifyToken } = require("./controllers/verify-tolken-middleware");

const app = express();
app.use(express.json());

// Users:
app.get("/api/users", getUsers);
app.get("/api/users/:username", getUserById);
app.post("/api/users", addUser);
app.delete("/api/users/:username", deleteUserByUsername);
app.post("/api/users/login", authenticateUser);

app.get("/api/protected", verifyToken, (req, res) => {
  res.send("This is a protected route");
});

//Collections:
app.get("/api/users/:username/collections", getUserCollections);
app.post("/api/users/:username/collections", addUserCollection);
app.delete(
  "/api/users/:username/collections/:speciesName",
  deleteUserCollection
);

// Handle unknown routes
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

// Tables dropping error
app.use((err, req, res, next) => {
  if (err.sqlState === "42S02") {
    res.send({ msg: "Tables have been dropped or they don't exist" });
  } else {
    next(err);
  }
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
  console.error("Unhandled Error:", err);
  res.status(500).send({ msg: "An unexpected error occurred" });
});

// Start the server and log the port
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
