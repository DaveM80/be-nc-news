const connection = require("../db/connection");

const selectComments = (idObj, reqQuery) => {
  const { sort_by = "created_at", order = "desc" } = reqQuery;
  const idObjKeys = Object.keys(idObj);
  return connection
    .select("*")
    .from("comments")
    .modify(query => {
      if (idObjKeys[0] === "article_id") {
        query
          .where(idObjKeys[0], idObj[idObjKeys[0]])
          .orderBy(sort_by, order)
          .returning("*");
      } else {
        query
          .where(idObjKeys[0], idObj[idObjKeys[0]])
          .first()
          .returning("*");
      }
    });
};

const insertComment = (article_id, author, body) => {
  return connection
    .insert({ article_id, author, body })
    .into("comments")
    .returning("*");
};
const amendComment = (comment_id, newData) => {
  return selectComments({ comment_id },{}).then(comment => {
    if (comment) {
      const increment = newData.inc_votes || 0
      comment.votes = comment.votes +increment ;
      return connection
        .update("votes", comment.votes)
        .from("comments")
        .where("comment_id", comment_id);
    } else {
      return false;
    }
  });
};
const removeComment = comment_id => {
  return connection("comments")
    .where("comment_id", comment_id)
    .delete();
};
module.exports = { selectComments, insertComment, amendComment, removeComment };
