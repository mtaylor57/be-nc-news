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
    FULL OUTER JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
    `)
    .then((articles) => articles.rows)
}