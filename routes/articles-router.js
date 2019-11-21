const articlesRouter = require('express').Router();
const {getArticle,patchArticles} = require('../controllers/articles-controller');
const {getComments,postComments} = require('../controllers/comments-controller');
const {send405Error} = require('../error-handling');


articlesRouter
.route("/")
.get(getArticle)
.all(send405Error)

articlesRouter
.route("/:article_id")
.get(getArticle)
.patch(patchArticles)
.all(send405Error)

articlesRouter
.route("/:article_id/comments")
.get(getComments)
.post(postComments)
.all(send405Error)

module.exports = articlesRouter;