const { selectArticle, amendArticle } = require("../models/articles-model");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticle(article_id, req.query)
    .then(articles => {
      if (Array.isArray(articles) && articles.length > 0) {
        return res.status(200).send({ articles });
      } else if (articles && !Array.isArray(articles)) {
        const article = articles;
        return res.status(200).send({ article });
      }
      return next({ status: 404, msg: "Not Found" });
    })
    .catch(next);
};
exports.patchArticles = (req, res, next) => {
  const { article_id } = req.params;
  const newData = req.body;
  return amendArticle(article_id, newData)
    .then(() => {
      return selectArticle(article_id, {});
    })
    .then(article => {
      if (article) return res.status(200).send({ article });
      return next({ status: 404, msg: "Not Found" });
    })
    .catch(next);
};
