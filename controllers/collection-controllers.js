const {
  selectUserCollections,
  insertUserCollection,
  updateCollection,
  deleteCollection,
  checkCollectionExists,
} = require("../models/collection-models");
const { checkUserExists } = require("../models/users-models");
const moment = require("moment");

exports.getUserCollections = (req, res, next) => {
  const { username } = req.params;
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
      next(err);
    });
};

exports.updateUserCollection = (req, res, next) => {
  const { username, collectionId } = req.params;
  const updates = req.body;
  checkCollectionExists(username, collectionId)
    .then(() => {
      return updateCollection(username, collectionId, updates);
    })
    .then((collection) => {
      res.status(200).send({ collection });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteUserCollection = (req, res, next) => {
  const { username, collectionId } = req.params;

  checkCollectionExists(username, collectionId)
    .then(() => {
      return deleteCollection(username, collectionId);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
