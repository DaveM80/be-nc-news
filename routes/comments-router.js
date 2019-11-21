const commentsRouter = require('express').Router();
const {patchComments,deleteComments} = require('../controllers/comments-controller');
const {send405Error} = require('../error-handling');

commentsRouter
.route("/:comment_id")
.patch(patchComments)
.delete(deleteComments)
.all(send405Error)
module.exports = commentsRouter