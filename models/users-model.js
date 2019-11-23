const connection = require("../db/connection");

const selectUser = username => {
  return connection
    .select("*")
    .from("users")
    .where({ username })
    .then(([user]) => {
      if (!user) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return user;
      }
    });
};

module.exports = { selectUser };
