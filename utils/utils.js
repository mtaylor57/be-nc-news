const db = require('../db/connection.js')

exports.checkArticleExists = (articleId) => {
    //return a promise reject if article not found
    return db.query(`
    SELECT * FROM articles
    WHERE article_id = $1;
    `,[articleId]).then((articles) => {
        if(articles.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'article not found'})
        }
    })
}