const express = require("express");

const {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  patchArticle,
  postComment,
  getUsers,
  deleteComment,
  getJson,
  seedDbs,
} = require("./controllers/news.js");

const app = express();

app.use(express.json());

app.get("/api", getJson);
app.get("/api/seed", seedDbs);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ msg: "missing required field" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(400).send({ msg: "invalid foreign key" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "incorrect data type passed" });
  } else {
    next(err)
  }
});
app.use((err,req,res,next) => {
  console.log(err)
  res.status(500).send({msg: "Server error"})
})

module.exports = app;
