const {
  selectAllArticles,
  selectArticleById,
  updateArticle
} = require("../models/articles-model");

exports.getAllArticles = (req, res, next) => {
  return selectAllArticles(req.query)
    .then(articles => {
      return res.status(200).send({ articles });
    })
    .catch(next);
};
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticleById(article_id)
    .then(article => {
      
      return res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  return updateArticle(article_id, req.body)
    .then(() => {
      return selectArticleById(article_id);
    })
    .then(article => {
      if (article) return res.status(200).send({ article });
      return next({ status: 404, msg: "Not Found" });
    })
    .catch(next);
};
