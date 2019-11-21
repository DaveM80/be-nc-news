const articlesRouter = require('express').Router();
const {getArticle,patchArticles} = require('../controllers/articles-controller');
const {getComments,postComments} = require('../controllers/comments-controller');


articlesRouter
.route("/")
.get(getArticle)

articlesRouter
.route("/:article_id")
.get(getArticle)
.patch(patchArticles)

articlesRouter
.route("/:article_id/comments")
.get(getComments)
.post(postComments)

module.exports = articlesRouter;