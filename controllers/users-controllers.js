const {
  selectAllUsers,
  selectUserById,
  createUser,
  deleteUser,
  updateUser,
  checkUserExists,
  loginUser,
} = require("../models/users-models");

exports.getUsers = (req, res, next) => {
  const {order} = req.query
  selectAllUsers(order)
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserById = (req, res, next) => {
  const { username } = req.params;
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

exports.postUser = (req, res, next) => {
  const newUser = req.body;
  return createUser(newUser)
    .then((user) => {
      res.status(201).json({ user});
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

exports.patchUserByUsername = (req, res, next) => {
  const { username } = req.params;
  const update = req.body;
  checkUserExists(username)
    .then(() => {
      return updateUser(username, update);
    })
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};


exports.authenticateUser = (req, res, next) => {
  const credentials = req.body;
  loginUser(credentials)
    .then(({ token, user }) => {
      return res.status(200).json({ token, user });
    })
    .catch((err) => {
      next(err);
    });
};
