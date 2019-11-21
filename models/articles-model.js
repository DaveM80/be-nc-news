const connection = require("../db/connection");

const selectArticle = (article_id, reqQuery) => {
  const { sort_by = "created_at", order = "desc", author, topic } = reqQuery;
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .modify(query => {
      if (article_id)
        return query.where("articles.article_id", article_id).first();
      if (author) query.where(`articles.author`, author);
      if (topic) return query.andWhere(`articles.topic`, topic);
    })
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .returning("*");
};
const amendArticle = (article_id, newData) => {
  return selectArticle(article_id, {}).then(article => {
    if (article) {
      const increment = newData.inc_votes || 0
      article.votes = article.votes + increment;
      return connection
        .update("votes", article.votes)
        .from("articles")
        .where("article_id", article_id)
        .returning("*");
    } else {
      return false;
    }
  });
};
module.exports = { selectArticle, amendArticle };
