const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const {customErrors,internalServerError} = require("./error-handling/");

app.use(express.json());

app.use("/api", apiRouter);

app.use(customErrors);

app.use(internalServerError);
module.exports = app;
