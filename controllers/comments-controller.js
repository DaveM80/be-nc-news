const {
  selectComments,
  insertComment,
  amendComment,
  removeComment
} = require("../models/comments-model");

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  if (+article_id > 0) {
    return selectComments({ article_id: article_id })
      .then(comments => {
        if (Array.isArray(comments) && comments.length > 0) {
          return res.status(200).send({ comments });
        } else if (comments && !Array.isArray(comments)) {
          const comment = comments;
          return res.status(200).send({ comment });
        }
        return next({ status: 404, msg: "Not Found" });
      })
      .catch(next);
  } else {
    return next({ status: 400, msg: "Bad Request" });
  }
};
exports.postComments = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  return insertComment(article_id, username, body).then(newComment => {
    res.status(201).send(newComment);
  });
};

exports.patchComments = (req, res, next) => {
  const { comment_id } = req.params;
  const { body } = req;
  return amendComment(comment_id, body)
    .then(() => {
      return selectComments({ comment_id: comment_id });
    })
    .then(comment => {
      if (comment) {
        return res.status(202).send({ comment });
      }
      return next({ status: 404, msg: "Not Found" });
    })

    .catch(next);
};

exports.deleteComments = (req, res, next) => {
  const { comment_id } = req.params;
  return removeComment(comment_id).then(() => {
    return res.sendStatus(204);
  });
};
