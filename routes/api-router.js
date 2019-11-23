const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const { send405Error } = require("../error-handling/");

apiRouter
  .route("/")
  .get((res,req,next)=>{
    res.status(200).send({
      status: 200,
      msg: "This where I would keep my documentation...If I had any!"
    })}
  )
  .all(send405Error);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);



module.exports = apiRouter;
