const connection = require("../db/connection");

const selectTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .returning("*");
};

module.exports = { selectTopics };