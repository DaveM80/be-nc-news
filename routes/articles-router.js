const articlesRouter = require('express').Router();
const {getAllArticles,getArticleById,patchArticle} = require('../controllers/articles-controller');
const {getCommentsByArticleId,postComment} = require('../controllers/comments-controller');
const {send405Error} = require('../error-handling');


articlesRouter
.route("/")
.get(getAllArticles)
.all(send405Error)

articlesRouter
.route("/:article_id")
.get(getArticleById)
.patch(patchArticle)
.all(send405Error)

articlesRouter
.route("/:article_id/comments")
.get(getCommentsByArticleId)
.post(postComment)
.all(send405Error)

module.exports = articlesRouter;