const {
  selectCommentsByArticleId,
  insertComment,
  updateComment,
  removeComment
} = require("../models/comments-model");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  return selectCommentsByArticleId(article_id, req.query)
    .then(comments => {
      return res.status(200).send({ comments });
    })
    .catch(next);
};
exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  return insertComment(article_id, username, body)
    .then(comment => {
      return res.status(201).send({ comment });
    })
    .catch(next);
};
exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { body } = req;
  return updateComment(comment_id, body)
    .then(comment => {
      return res.status(200).send({ comment });
    })
    .catch(next);
};
exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  return removeComment(comment_id)
    .then(deletedCount => {
      if (deletedCount > 0) return res.sendStatus(204);
      else return next({ status: 404, msg: "Not Found" });
    })
    .catch(next);
};
