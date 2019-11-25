const connection = require("../db/connection");
const { exsistanceCheck } = require("../db/utils/utils");
const { selectArticleById } = require("./articles-model");

const selectCommentsByArticleId = (article_id, reqQuery) => {
  const filter = {
    val: "",
    lookupFunc: ""
  };
  filter.val = article_id;
  filter.lookupFunc = selectArticleById;
  const { sort_by = "created_at", order = "desc" ,username} = reqQuery;
  const author = username;
  const slectCommentsQuery = connection
  .select("*")
  .from("comments")
  .modify(query=>{
    query.where({ article_id })
    if(author) query.andWhere({author})
  })
  .orderBy(sort_by, order)
  .then(comments => {
    if (!comments) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return comments;
      }
    });
    return Promise.all([exsistanceCheck(filter), slectCommentsQuery]).then(
      ([article, comments]) => {
        return comments;
      }
    );
  };
const selectCommentsByCommentId = (comment_id) => {
  return connection
    .select("*")
    .from("comments")
    .where({ comment_id })
    .first()
    .then(comments => {
      if (!comments) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return comments;
      }
    });

};
const insertComment = (article_id, author, body) => {
  if (!author || !body) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {

    return connection
      .insert({ article_id, author, body })
      .into("comments")
      .returning("*")
      .then(([comment]) => {
        if (!comment) {
          return Promise.reject({ status: 404, msg: "Not Found" });
        } else {
          return comment;
        }
      });
  }
};
const updateComment = (comment_id, newData) => {
  return selectCommentsByCommentId(comment_id, {})
  .then(comment => {
      const increment = newData.inc_votes || 0;
      comment.votes = comment.votes + increment;
      return connection
        .update("votes", comment.votes)
        .from("comments")
        .where({comment_id})
        .returning("*")
        .then(([comment]) =>{
          if (!comment) {
            return Promise.reject({ status: 404, msg: "Not Found" });
          } else {
            return comment;
          }
        });
      })
};
const removeComment = comment_id => {
  return connection("comments")
    .where({comment_id})
    .delete();
};
module.exports = {
  selectCommentsByArticleId,
  selectCommentsByCommentId,
  insertComment,
  updateComment,
  removeComment
};
