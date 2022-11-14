const { selectTopics, selectArticles, selectArticleById } = require('../models/news.js')

exports.getTopics = (req,res,next) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    })
}

exports.getArticles = (req,res,next) => {
    selectArticles().then((articles) => {
        res.status(200).send({articles})
    })
}

exports.getArticleById = (req,res,next) => {
    const articleId = req.params.article_id
    selectArticleById(articleId).then((article) => {
        res.status(200).send({article})
    })
}