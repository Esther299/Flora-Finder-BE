const {
  selectAllUsers,
  selectUserById,
  deleteUser,
  checkUserExists,
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
  //console.log(`Fetching user by username: ${username}`);
  selectUserById(username)
    .then((user) => {
      if (!user) {
        console.log(`User not found: ${username}`);
      }
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteUserByUsername = (req, res, next) => {
  const { username } = req.params;
  checkUserExists(username)
    .then(() => {
      return deleteUser(username);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
