const express = require('express')

const { getTopics, 
        getArticles, 
        getArticleById,
        getCommentsByArticleId,
        patchArticle
        } = require('./controllers/news.js')

const app = express()

app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.patch('/api/articles/:article_id',patchArticle)

app.use((err,req,res,next) => {
    if(err.msg && err.status) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err)
    }
})

app.use((err,req,res,next) => {
    if (err.code === "22P02") {
    res.status(400).send({ msg: "incorrect data type passed" });
  }
})

module.exports = app