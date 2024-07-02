const {
  selectAllUsers,
  selectUserById,
  selectUserCollections,
  insertUserCollection,
  updateCollection,
  deleteCollection,
  deleteUser,
} = require("../models/users-models");

exports.getUsers = (req, res, next) => {
  selectAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserById = (req, res, next) => {
  const { username } = req.params;
  console.log(`Fetching user by username: ${username}`);
  selectUserById(username)
    .then((user) => {
      if (!user) {
        console.log(`User not found: ${username}`);
        return res.status(404).send({ msg: "User not found" });
      }
      res.status(200).send({ user });
    })
    .catch((err) => {
      console.log(`Error fetching user: ${err}`);
      next(err);
    });
};

exports.getUserCollections = (req, res, next) => {
  const { username } = req.params;
  console.log(`Fetching collections for user: ${username}`);
  selectUserCollections(username)
    .then((collections) => {
      res.status(200).send({ collections });
    })
    .catch((err) => {
      console.log(`Error fetching collections: ${err}`);
      next(err);
    });
};

exports.addUserCollection = (req, res, next) => {
  const { username } = req.params;
  const newCollection = req.body;
  insertUserCollection(username, newCollection)
    .then((collection) => {
      res.status(201).send({ collection });
    })
    .catch((err) => {
      console.log(`Error adding collection: ${err}`);
      next(err);
    });
};

exports.updateUserCollection = (req, res, next) => {
  const { username, collectionId } = req.params;
  const updates = req.body;
  updateCollection(username, collectionId, updates)
    .then((collection) => {
      if (!collection) {
        return res.status(404).send({ msg: "Collection not found" });
      }
      res.status(200).send({ collection });
    })
    .catch((err) => {
      console.log(`Error updating collection: ${err}`);
      next(err);
    });
};

exports.deleteUserCollection = (req, res, next) => {
  const { username, collectionId } = req.params;
  deleteCollection(username, collectionId)
    .then((deleted) => {
      if (!deleted) {
        return res.status(404).send({ msg: "Collection not found" });
      }
      res.status(204).send();
    })
    .catch((err) => {
      console.log(`Error deleting collection: ${err}`);
      next(err);
    });
};

exports.deleteUserByUsername = (req, res, next) => {
  const { username } = req.params;
  deleteUser(username)
    .then((deleted) => {
      if (!deleted) {
        return res.status(404).send({ msg: "User not found" });
      }
      res.status(204).send();
    })
    .catch((err) => {
      console.log(`Error deleting user: ${err}`);
      next(err);
    });
};
