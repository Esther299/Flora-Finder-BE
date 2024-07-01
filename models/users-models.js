const pool = require('../db/connection')

exports.selectAllUsers = () => {
    return pool.query('SELECT * FROM users;').then((result) => {
      return result[0];
    });
  };