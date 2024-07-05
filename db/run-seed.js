const seedDatabase = require("./seed.js");
const pool = require("./connection.js");

const runSeed = async () => {
  try {
    await seedDatabase();
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    pool.end();
  }
};

runSeed();