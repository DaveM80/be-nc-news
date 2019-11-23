const { selectUser } = require("../models/users-model");

exports.getUser = (req, res, next) => {
  const { username } = req.params;
  return selectUser(username)
    .then(user => {
      return res.status(200).send({ user });
    })
    .catch(next);
};
