const db = require('../db/connection.js')

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
    JOIN comments
    ON articles.article_id = comments.comment_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
    `)
    .then((articles) => articles.rows)
}


exports.selectArticleById = (articleId) => {
    return db.query(`
    SELECT * FROM articles
    WHERE article_id = $1;
    `,[articleId]).then((article) => article.rows)
}