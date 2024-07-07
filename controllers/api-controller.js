const { selectEndpoint } = require("../models/api-model");

exports.getEndpoints = (req, res, next) => {
  selectEndpoint()
    .then((endpointsData) => {
      res.status(200).send({ endpointsData });
    })
    .catch((err) => {
      next(err);
    });
};
