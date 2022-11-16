
const { selectTopics, 
        selectArticles, 
        selectArticleById, 
        selectCommentsByArticleId,
        editArticle,
        insertComment
        } = require('../models/news.js')

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
    .catch((err) => {
        next(err)
    })
}

exports.getCommentsByArticleId = (req,res,next) => {
    const articleId = req.params.article_id
    selectCommentsByArticleId(articleId).then((comments) => {
        res.status(200).send({comments})
    }).catch((err) => {
        next(err)
    })
}

exports.postComment = (req,res,next) => {
    const articleId = req.params.article_id
    const newComment = req.body
    insertComment(articleId,newComment).then((comment) => {
        res.status(201).send({comment})
    }).catch((err) => {
        next(err)
    })
}

exports.patchArticle = (req,res,next) => {
    const articleId = req.params.article_id
    const articleInfo = req.body
    editArticle(articleId,articleInfo).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
      next(err)
    })
}
