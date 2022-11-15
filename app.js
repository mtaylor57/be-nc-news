const express = require('express')

const { getTopics, 
        getArticles, 
        getArticleById,
        getCommentsByArticleId 
        } = require('./controllers/news.js')

const app = express()

app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.use((err,req,res,next) => {
    if(err.msg && err.status) {
        res.status(err.status).send({ msg: err.msg });
    }
})

module.exports = app