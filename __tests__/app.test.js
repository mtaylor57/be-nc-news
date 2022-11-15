const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");

afterAll(() => {
    return db.end()
})

beforeEach(() => seed(data))

describe('/api/topics', () => {
    test('should get an array of topic objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((result) => {
            const { topics } = result.body
            expect(topics).toBeInstanceOf(Array)
            expect(topics).toHaveLength(3)
            topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    });
});




describe('/api/articles/:article_id', () => {
    test('should get an article object specified by the endpoint', () => {
        return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then((result) => {
            const { article } = result.body
            expect(article).toMatchObject({
                article_id: 2,
                title: expect.any(String),
                topic: 'mitch',
                author: 'icellusedkars',
                body: expect.any(String),
                created_at: '2020-10-16T05:03:00.000Z',
                votes: expect.any(Number)
            })
        })
    });
    test('should return an error message if id not found', () => {
        return request(app)
        .get('/api/articles/1000')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('id not found')
        })
    });
    test('should return an error message if id not a number', () => {
        return request(app)
        .get('/api/articles/a')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('id is not a number')

describe('/api/articles', () => {
    test('should get an array of articles with correct properties and comment count', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((result) => {
            const { articles } = result.body
            expect(articles).toBeInstanceOf(Array)
            expect(articles).toHaveLength(12)
            articles.forEach((article) => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String)
                })
            })
        })
    });
    test('the articles should be sorted by date in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((result) => {
            const { articles } = result.body
            expect(articles).toBeSortedBy('created_at',{descending:true})

        })
    });
});