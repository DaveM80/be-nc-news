process.env.NODE_ENV = "test";
const request = require("supertest");
const { expect } = require("chai");
const connection = require("../db/connection");
const app = require("../app");

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => {
    return connection.destroy();
  });
  describe("/topics", () => {
    it("GET:200 returns array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.include.keys("topics");
          expect(body.topics[0]).to.include.keys("slug", "description");
        });
    });
    it("GET:404 Route not found", () => {
      return request(app)
        .get("/api/NotARoute")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route Not Found");
        });
    });
  });
  describe("/users/:username", () => {
    it("GET:200 returns specified user object", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.include.keys("username", "avatar_url", "name");
        });
    });
    it("Get:404 Not Found", () => {
      return request(app)
        .get("/api/users/NotAUser")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });
    it("Get:400 bad request", () => {
      return request(app)
        .get("/api/users")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
  });
  describe.only("/articles/:article_id", () => {
    it("Get:200  returns article object ", () => {
      const testArticle = 
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        body: "I find this existence challenging",
        votes: 100,
        topic: "mitch",
        author: "butter_bridge",
        created_at: "2018-11-15T12:21:54.000Z"
      };
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          console.log(body);
          expect(body).to.contain.keys(Object.keys(testArticle))
        });
    });
  });
});
