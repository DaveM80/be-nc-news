const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const cors =require('cors');
const {
  customErrors,
  sqlErrors,
  internalServerError
} = require("./error-handling/");
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.all("/*", (req, res, next) => next({ status: 404, msg: "Not Found" }));
app.use(customErrors);
app.use(sqlErrors);
app.use(internalServerError);

module.exports = app;
