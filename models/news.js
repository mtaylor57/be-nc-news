const db = require("../db/connection.js");
const { checkArticleExists } = require("../utils/utils.js");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((topics) => topics.rows);
};

exports.selectArticles = (
  topicFilter,
  sortBy = "created_at",
  orderBy = "desc",
  queryNames
) => {
  let where = ""; //responds with all articles if topic query omitted
  let topicArr = [];
  if (topicFilter) {
    where = "WHERE topic = $1";
    topicArr.push(topicFilter);
  }
  const validColumns = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
  ];
  const validOrders = ["desc", "asc"];
  const validQueries = ["topic", "sort_by", "order_by"];
  for (i = 0; i < queryNames.length; i++) {
    if (!validQueries.includes(queryNames[i])) {
      return Promise.reject({ status: 400, msg: "bad request!" });
    }
  }
  if (!validColumns.includes(sortBy) || !validOrders.includes(orderBy)) {
    return Promise.reject({ status: 400, msg: "bad request!" });
  }

  return db
    .query(
      `
    SELECT articles.author,
    title,
    articles.article_id,
    topic,
    articles.created_at,
    articles.votes,
    COUNT(comments.comment_id) AS comment_count FROM articles
    FULL OUTER JOIN comments
    ON articles.article_id = comments.article_id
    ${where}
    GROUP BY articles.article_id
    ORDER BY ${sortBy} ${orderBy};
    `,
      topicArr
    )
    .then((articles) => {
      return articles.rows;
    });
};

exports.selectArticleById = (articleId) => {
  if (isNaN(Number(articleId))) {
    return Promise.reject({ status: 400, msg: "id is not a number" });
  }
  return db
    .query(
      `
      SELECT articles.author,
      title,
      articles.article_id,
      articles.body,
      topic,
      articles.created_at,
      articles.votes,
      COUNT(comments.comment_id) AS comment_count FROM articles
      FULL OUTER JOIN comments
      ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;
    `,
      [articleId]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "id not found" });
      }
      return article.rows[0];
    });
};

exports.selectCommentsByArticleId = (articleId) => {
  if (isNaN(Number(articleId))) {
    return Promise.reject({ status: 400, msg: "id is not a number" });
  }
  return checkArticleExists(articleId)
    .then(() => {
      //only gets in here if the article exists
      //otherwise goes straight to catch
      return db.query(
        `
        SELECT comment_id,votes,created_at,author,article_id,body FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;
        `,
        [articleId]
      );
    })
    .then((comments) => {
      return comments.rows;
    });
};

exports.insertComment = (articleId, newComment) => {
  if (isNaN(Number(articleId))) {
    return Promise.reject({ status: 400, msg: "id is not a number" });
  }
  return checkArticleExists(articleId)
    .then(() => {
      const { username, body } = newComment;
      return db.query(
        `
        INSERT INTO comments
        (author,body,article_id)
        VALUES
        ($1,$2,$3)
        RETURNING *;
        `,
        [username, body, articleId]
      );
    })
    .then((comment) => {
      return comment.rows[0];
    });
};

exports.editArticle = (articleId, articleInfo) => {
  if (isNaN(Number(articleId))) {
    return Promise.reject({ status: 400, msg: "id is not a number" });
  }
  const { inc_votes } = articleInfo;
  return checkArticleExists(articleId)
    .then(() => {
      return db.query(
        `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
        `,
        [inc_votes, articleId]
      );
    })
    .then((article) => {
      return article.rows[0];
    });
};

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then((users) => users.rows);
};

exports.removeComment = (commentId) => {
  if (isNaN(Number(commentId))) {
    return Promise.reject({ status: 400, msg: "id is not a number" });
  }
  return db
    .query(
      `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *;
  `,
      [commentId]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "comment not found",
        });
      }
    });
};
