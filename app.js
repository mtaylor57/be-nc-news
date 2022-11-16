const express = require('express')

const { getTopics, 
        getArticles, 
        getArticleById,
        getCommentsByArticleId,
        postComment 
        } = require('./controllers/news.js')

const app = express()

app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments',postComment)

app.use((err,req,res,next) => {
    if(err.msg && err.status) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err)
    }
})

app.use((err,req,res,next) => {
    if (err.code === "23502") {
        res
          .status(400)
          .send({ msg: "missing required field" });
      } else {
        next(err)
      }
})

app.use((err,req,res,next) => {
    if (err.code === "23503") {
        res
          .status(400)
          .send({ msg: "invalid foreign key" });
      } else {
        next(err)
      }
})
module.exports = app