const {selectArticle} = require("../models/articles-model");

exports.getArticle = (req, res, next) => {
    const {article_id} = req.params
  return selectArticle(article_id)
    .then(article => {
        if (article) return res.status(200).send(article);
        return next({ status: 404, msg: "Not Found" });
    })
    .catch(next);
};
