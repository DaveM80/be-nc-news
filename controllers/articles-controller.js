const { selectArticle, amendArticle } = require("../models/articles-model");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticle(article_id)
  .then(article => {
      if (article) return res.status(200).send(article);
      return next({ status: 404, msg: "Not Found" });
    })
    .catch(next);
};
exports.patchArticles = (req, res, next) => {
  const { article_id } = req.params;
  const newData = req.body;
  return amendArticle(article_id, newData)
  .then(() => {
    return selectArticle(article_id)
  })
  .then(article =>{
    if (article) return res.status(202).send(article);
    return next({ status: 400, msg: "Bad Request" });
  })
  .catch(next);
};
