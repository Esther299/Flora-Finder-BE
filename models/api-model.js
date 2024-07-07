const fsPromises = require("fs").promises;

exports.selectEndpoint = async () => {
  const data = await fsPromises.readFile("./endpoint.json", "utf8");
  return JSON.parse(data);
};
