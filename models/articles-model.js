const connection = require("../db/connection");

const selectArticle = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .modify(query => {
       if (article_id) query.where("articles.article_id", article_id).first();
       // if (article_id) query.where("article_id",article_id)
     })
    .groupBy('articles.article_id');
};
const amendArticle = (article_id, newData) => {
  return selectArticle(article_id)
    .then(article => {
      if (article) {
        article.votes = article.votes + newData.inc_votes;
        return connection
          .update("votes", article.votes)
          .from("articles")
          .where("article_id", article_id)
      } else {
        return [];
      }
    })
    .catch(console.log);
};
module.exports = { selectArticle, amendArticle };
