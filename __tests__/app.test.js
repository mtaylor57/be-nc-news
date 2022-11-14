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



describe.only('/api/articles/:article_id', () => {
    test('should get an article object specified by the endpoint', () => {
        return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then((result) => {
            const { article } = result.body
            expect(article[0]).toMatchObject({
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
});