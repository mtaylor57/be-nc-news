const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");
const jsonObj = require("../endpoints.json");

afterAll(() => {
  return db.end();
});

beforeEach(() => seed(data));

describe("GET/api/topics", () => {
  test("should get an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((result) => {
        const { topics } = result.body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET/api/articles", () => {
  test("should get an array of articles with correct properties and comment count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((result) => {
        const { articles } = result.body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("the articles should be sorted by date in descending order (default)", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((result) => {
        const { articles } = result.body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("the articles should be sorted by any valid column in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then((result) => {
        const { articles } = result.body;
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("the articles should be sorted by any valid column in the order specified", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order_by=asc")
      .expect(200)
      .then((result) => {
        const { articles } = result.body;
        expect(articles).toBeSortedBy("author", { descending: false });
      });
  });
  test("should get articles filtered by the given topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((result) => {
        const { articles } = result.body;
        expect(articles).toHaveLength(1);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: "cats",
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });
  describe("error handling", () => {
    test("should return a message if sort_by query is not valid", () => {
      return request(app)
        .get("/api/articles?sort_by=somethingbad")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request!");
        });
    });
    test("should return a message if order_by query is not valid", () => {
      return request(app)
        .get("/api/articles?order_by=somethingbad")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request!");
        });
    });
    test("what if query doesnt exist", () => {
      return request(app)
        .get("/api/articles?bad_query=somethingbad")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request!");
        });
    });
  });
});

describe("GET/api/articles/:article_id", () => {
  test("should get an article object specified by the endpoint", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((result) => {
        const { article } = result.body;
        expect(article).toMatchObject({
          article_id: 2,
          title: expect.any(String),
          topic: "mitch",
          author: "icellusedkars",
          body: expect.any(String),
          created_at: "2020-10-16T05:03:00.000Z",
          votes: expect.any(Number),
        });
      });
  });
  test("should return an article object with comment count (non-zero comment count)", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((result) => {
        const { article } = result.body;
        expect(article).toMatchObject({
          article_id: 3,
          title: expect.any(String),
          topic: "mitch",
          author: "icellusedkars",
          body: expect.any(String),
          created_at: "2020-11-03T09:12:00.000Z",
          votes: expect.any(Number),
          comment_count: "2",
        });
      });
  });
  test("should return an error message if id not found", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("id not found");
      });
  });
  test("should return an error message if id not a number", () => {
    return request(app)
      .get("/api/articles/a")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("id is not a number");
      });
  });
});

describe("GET/api/articles/:article_id/comments", () => {
  test("should get all comments associated with article id with most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((result) => {
        const { comments } = result.body;
        expect(comments).toHaveLength(11);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: 1,
            created_at: expect.any(String),
          });
        });
      });
  });
  test("should get an empty array when article id is valid but has no assocoiated comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((result) => {
        const { comments } = result.body;
        expect(comments).toHaveLength(0);
      });
  });
  test("should return an error message if id not found", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
  test("should return an error message if id not a number", () => {
    return request(app)
      .get("/api/articles/a/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("id is not a number");
      });
  });
});

describe("PATCH/api/articles/:article_id", () => {
  test("should patch an article with update vote count", () => {
    const articleInfo = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/3")
      .send(articleInfo)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 10,
        });
      });
  });
  test("should return a message if article id not a number", () => {
    const articleInfo = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/a")
      .send(articleInfo)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("id is not a number");
      });
  });
  test("should return a message if article id not found", () => {
    const articleInfo = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/1000")
      .send(articleInfo)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
  test("should return a message if passed object has missing property", () => {
    const articleInfo = { random: 10 };
    return request(app)
      .patch("/api/articles/3")
      .send(articleInfo)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("missing required field");
      });
  });
  test("should return a message if passed object has incorrect data type", () => {
    const articleInfo = { inc_votes: "hello" };
    return request(app)
      .patch("/api/articles/3")
      .send(articleInfo)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("incorrect data type passed");
      });
  });
});

describe("POST/api/articles/:article_id/comments", () => {
  test("should post an object with username and body properties", () => {
    const newComment = {
      username: "butter_bridge",
      body: "testing the post comment functionality",
      random: "should be ignored",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          article_id: expect.any(Number),
          created_at: expect.any(String),
          author: "butter_bridge",
          body: "testing the post comment functionality",
        });
      });
  });
  test("should return an error message if id not a number", () => {
    return request(app)
      .post("/api/articles/a/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("id is not a number");
      });
  });
  test("should return an error message if id not found", () => {
    return request(app)
      .post("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
  test("should return a message if the passed object is missing required properties", () => {
    const newComment = {
      username: "butter_bridge",
      random: "should be ignored",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("missing required field");
      });
  });
  test("should return a message if the passed object has username not in database", () => {
    const newComment = {
      username: "baduser",
      body: "testing the post comment functionality",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid foreign key");
      });
  });
});

describe("GET/api/users", () => {
  test("should respond with an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((result) => {
        const { users } = result.body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("DELETE/api/comments/:comment_id", () => {
  test("should respond with 204 and no content when delete is complete", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("should return message when comment_id is NaN", () => {
    return request(app)
      .delete("/api/comments/a")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("id is not a number");
      });
  });
  test("should return a message if comment id not found", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment not found");
      });
  });
});

describe("GET/api", () => {
  test("should respond with a JSON describing all the available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((result) => {
        const { endpoints } = result.body;
        expect(endpoints).toMatchObject(jsonObj);
      });
  });
});

// describe('seeding database', () => {
//   test('should respond with message when database sucessfully seeded', () => {
    
//   });
// });
