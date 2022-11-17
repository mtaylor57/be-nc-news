const {
  selectTopics,
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  editArticle,
  insertComment,
  selectUsers,
} = require("../models/news.js");
let endpoints = require('../endpoints.json')

exports.getTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticles = (req, res, next) => {
  const topicFilter = req.query.topic
  const sortBy = req.query.sort_by
  const orderBy = req.query.order_by
  const queryNames = Object.keys(req.query)
  selectArticles(topicFilter,sortBy,orderBy,queryNames).then((articles) => {
    res.status(200).send({ articles });
  }).catch((err) => {
    next(err)
  })
};

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  selectArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  selectCommentsByArticleId(articleId)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const articleId = req.params.article_id;
  const newComment = req.body;
  insertComment(articleId, newComment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  const articleInfo = req.body;
  editArticle(articleId, articleInfo)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getJson = (req,res,next) => {
  res.status(200).send({endpoints})
}
