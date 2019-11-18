const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router');




apiRouter.get("/",(req,res,next)=>{
    console.log("api router")
})
apiRouter.get("/topics",topicsRouter)


module.exports = apiRouter;