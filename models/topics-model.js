const connection = require("../db/connection");

const selectTopics = slug => {
  return connection
    .select("*")
    .from("topics")
    .modify(query => {
      if (slug) query.where({slug});
    })
    .then(topics => {
      if (topics.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
    }else{
      return topics;
    } 
})};

module.exports = { selectTopics };
