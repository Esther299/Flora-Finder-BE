const {
  selectAllUsers,
  selectUserById,
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
      console.log(`Error fetching user: ${err.code, err.msg}`);
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
      console.log(`Error deleting user: ${(err.code, err.msg)}`);
      next(err);
    });
};
