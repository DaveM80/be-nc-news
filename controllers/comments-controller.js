const {
  selectComments,
  insertComment,
  amendComment,
  removeComment
} = require("../models/comments-model");

exports.getComments = (req, res, next) => {
  const { article_id, comment_id } = req.params;
  const search_id = { article_id } || { comment_id };
  if (+search_id.article_id > 0 || +search_id.comment_id > 0) {
    return selectComments(search_id, req.query)
      .then(comments => {
        if (
          (Array.isArray(comments) && comments.length > 0) ||
          (Array.isArray(comments) && article_id)
        ) {
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
  if (username && body) {
    return insertComment(article_id, username, body)
      .then(([comment]) => {
        res.status(201).send({ comment });
      })
      .catch(next);
  }else{
    next({status:400,msg:"Bad Request"})
  }
};

exports.patchComments = (req, res, next) => {
  const { comment_id } = req.params;
  const { body } = req;
  return amendComment(comment_id, body)
    .then(() => {
      return selectComments({ comment_id }, {});
    })
    .then(comment => {
      if (comment) {
        return res.status(200).send({ comment });
      }
      return next({ status: 404, msg: "Not Found" });
    })

    .catch(next);
};

exports.deleteComments = (req, res, next) => {
  const { comment_id } = req.params;
  return removeComment(comment_id)
  .then(deletedCount => {
    if (deletedCount>0) return res.sendStatus(204);
    else return next({ status: 404, msg: "Not Found" });
  }).catch(next);
};
