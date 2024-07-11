const {
  selectUserCollections,
  insertUserCollection,
  deleteCollection,
  checkCollectionExists,
} = require("../models/collection-models");
const { checkUserExists } = require("../models/users-models");

exports.getUserCollections = (req, res, next) => {
  const { username } = req.params;
  const options = req.query
  console.log(options)
  const promises = [selectUserCollections(username, options)];

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
      res.status(201).send({ collection });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteUserCollection = (req, res, next) => {
  const { username, plantId } = req.params;
  checkCollectionExists(username, plantId)
    .then(() => {
      return deleteCollection(username, plantId);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
