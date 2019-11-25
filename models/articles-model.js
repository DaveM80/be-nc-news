const connection = require("../db/connection");
const { selectUser } = require("./users-model");
const { selectTopics } = require("./topics-model");
const { exsistanceCheck } = require("../db/utils/utils");

const selectAllArticles = reqQuery => {
  const { sort_by = "created_at", order = "desc", author, topic } = reqQuery;

  const filter = {
    val: "",
    lookupFunc: ""
  };
  if (author) {
    filter.val = author;
    filter.lookupFunc = selectUser;
  } else if (topic) {
    filter.val = topic;
    filter.lookupFunc = selectTopics;
  }

  const selectArticlesQuery = connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .modify(query => {
      if (author) query.where("articles.author", author);
      if (topic) return query.andWhere("articles.topic", topic);
    })
    .groupBy("articles.article_id")
    .orderBy(sort_by, order);

  return Promise.all([exsistanceCheck(filter), selectArticlesQuery]).then(
    ([user, articles]) => {
      return articles;
    }
  );
};
const selectArticleById = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .where("articles.article_id", article_id)
    .groupBy("articles.article_id")
    .first()
    .then(article => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return article;
      }
    });
};

const updateArticle = (article_id, reqBody) => {
  return selectArticleById(article_id)
    .then(article => {
      const increment = reqBody.inc_votes || 0;
      article.votes = article.votes + increment;
      return connection
        .update("votes", article.votes)
        .from("articles")
        .where({ article_id });
    })
    .then(article => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return article;
      }
    });
};
module.exports = { selectAllArticles, selectArticleById, updateArticle };
