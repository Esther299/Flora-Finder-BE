const {
  selectUserCollections,
  insertUserCollection,
  updateCollection,
  deleteCollection,
} = require("../models/collection-models");
const {checkUserExists} = require('../models/users-models')
const moment = require("moment");

exports.getUserCollections = (req, res, next) => {
  const { username } = req.params;
console.log(`Fetching collections for user: ${username}`);
  const promises = [selectUserCollections(username)];

  if (username) {
    promises.push(checkUserExists(username));
  }

  Promise.all(promises)
    .then((result) => {
      const collections = result[0];
      res.status(200).send({ collections });
    })
    .catch((err) => {
      console.log(`Error fetching collections: ${err.code, err.msg}`);
      next(err);
    });
};

exports.addUserCollection = (req, res, next) => {
  const { username } = req.params;
  const newCollection = req.body;

  checkUserExists(username)
    .then(() => {
      return insertUserCollection(username, newCollection);
    })
    .then((collection) => {
      collection.dateCollected = moment(collection.dateCollected).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      res.status(201).send({ collection });
    })
    .catch((err) => {
      console.log(`Error adding collection: ${err.code, err.msg}`);
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
      console.log(`Error updating collection: ${err.code, err.msg}`);
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
      console.log(`Error deleting collection: ${err.code, err.msg}`);
      next(err);
    });
};
