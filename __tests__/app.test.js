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
            topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    });
});