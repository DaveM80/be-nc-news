


exports.customErrors = (err,req,res,next) => {
    if (err.status) res.status(err.status).send(err)
    else next(err)
    
   
}
exports.internalServerError = (req,res,next) => {
    res.status(500).send("Internal Server Error")
}