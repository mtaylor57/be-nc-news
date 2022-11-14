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