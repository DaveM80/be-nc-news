const usersRouter = require('express').Router();
const {getUser} = require('../controllers/users-controller');
const {send405Error} = require('../error-handling');

usersRouter
.route("/:username")
.get(getUser)
.all(send405Error)

module.exports = usersRouter;