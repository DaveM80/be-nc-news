const connection = require("../db/connection");

const selectComments = idObj => {
  return connection
    .select("*")
    .from("comments")
    .modify(query => {
      const idObjKeys = Object.keys(idObj);
      if (+idObj[idObjKeys[0]] > 0) {
        query.where(idObjKeys[0], idObj[idObjKeys[0]]).first();
      }
    })
    .returning("*");
};

const insertComment = (article_id, author, body) => {
  return connection
    .insert({ article_id, author, body })
    .into("comments")
    .returning("*");
};
const amendComment = (comment_id, newData) => {
  return selectComments({ comment_id: comment_id })
    .then(comment => {
      if (comment) {
        comment.votes = comment.votes + newData.inc_votes;
        return connection
          .update("votes", comment.votes)
          .from("comments")
          .where("comment_id", comment_id);
      } else {
        return [];
      }
    })
    .catch(console.log);
};
const removeComment = (comment_id) => {
  return connection("comments")
  .where("comment_id",comment_id)
  .delete()
};
module.exports = { selectComments, insertComment, amendComment, removeComment };
