const topicsRouter = require('express').Router();

topicsRouter.get("/topics",(req,res,next)=>{
    console.log("topics router")
})

module.exports = topicsRouter;