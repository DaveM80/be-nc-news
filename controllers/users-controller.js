const { selectUser } = require("../models/users-model");

exports.getUser = (req, res, next) => {
  const { username } = req.params;
  return selectUser(username)
    .then(user => {
      console.log(user);
      if (user) return res.status(200).send(user);
      return next({ status: 404, msg: "Not Found" });
    })
    .catch(next);
};
