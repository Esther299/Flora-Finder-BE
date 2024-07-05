const seedDatabase = require("./seed.js");
const pool = require("./connection.js");

const runSeed = () => {
  return seedDatabase().then(() => pool.end());
};

runSeed();