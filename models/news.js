const db = require('../db/connection.js')
const { checkArticleExists } = require('../utils/utils.js')

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then((topics) => topics.rows)
}

exports.selectArticles = () => {
    return db.query(`
    SELECT articles.author,
    title,
    articles.article_id,
    topic,
    articles.created_at,
    articles.votes,
    COUNT(*) AS comment_count FROM articles
    FULL OUTER JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
    `)
    .then((articles) => articles.rows)
}

exports.selectArticleById = (articleId) => {
    if(!Number(articleId)){
        return Promise.reject({status:400, msg:'id is not a number'})
    }
    return db.query(`
    SELECT * FROM articles
    WHERE article_id = $1;
    `,[articleId]).then((article) => {
        if (article.rows.length === 0){
            return Promise.reject({status:404,msg:'id not found'})
          }
        return article.rows[0]
    })

}

exports.selectCommentsByArticleId = (articleId) => {
    if(!Number(articleId)){
        return Promise.reject({status:400, msg:'id is not a number'})
    }
    return checkArticleExists(articleId).then(() => {
        //only gets in here if the article exists
        //otherwise goes straight to catch
        return db.query(`
        SELECT comment_id,votes,created_at,author,body FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;
        `,[articleId])
    })
    .then((comments) => {
        return comments.rows
    })
}

exports.editArticle = (articleId,articleInfo) => {
    if(!Number(articleId)){
        return Promise.reject({status:400, msg:'id is not a number'})
    }
    const {inc_votes} = articleInfo
    return checkArticleExists(articleId).then(() => {
        return db.query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
        `,[inc_votes,articleId])
    })
    .then((article) => {
        return article.rows[0]
    })
}