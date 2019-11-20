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
    it("GET:404 Not Found", () => {
      return request(app)
        .get("/api/NotARoute")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
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
    it("Get:404 bad request", () => {
      return request(app)
        .get("/api/users")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });
  });
  describe("/articles/:article_id", () => {
    it("Get:200  returns articles object array if no id provided", () => {
      const testArticle = {
        article_id: 1,
        title: "Living in the shadow of a great man",
        body: "I find this existence challenging",
        votes: 100,
        topic: "mitch",
        author: "butter_bridge",
        created_at: "2018-11-15T12:21:54.000Z",
        comment_count: 2
      };
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body[0]).to.contain.keys(Object.keys(testArticle));
        });
    });
    it("Get:200  returns article object ", () => {
      const testArticle = {
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
          expect(body).to.contain.keys(Object.keys(testArticle));
        });
    });
    it("PATCH:201 return updated object", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(202)
        .then(({ body }) => {
          expect(body.votes).to.equal(101);
        });
    });
    it("PATCH:400 Bad Request", () => {
      return request(app)
        .patch("/api/articles/500")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
  });
  describe("/articles/:article_id/comments", () => {
    it("GET:200 returns arrray of comment objects", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body:{comments}}) => {
          const testComments = {
            comment_id: 13,
            author: "icellusedkars",
            article_id: 1,
            votes: 0,
            created_at: "2005-11-25T12:36:03.000Z",
            body: "Fruit pastilles"
          };
          expect(comments[0]).to.contain.keys(Object.keys(testComments));
        });
    });
    it("GET:404 Not Found when valid ID not found", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({body}) => {
  
          expect(body.msg).to.equal("Not Found");
        });
    });
    it("GET:400 Bad Request when not valid ID", () => {
      return request(app)
        .get("/api/articles/banan/comments")
        .expect(400)
        .then(({body}) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
    it('POST:201', () => {
      return request(app)
      .post("/api/articles/1/comments")
      .send({username:"lurker",body:"This is a test comment"})
      .expect(201)
      .then(({body})=>{
        const templateComments = {
          comment_id: 19,
          author: "lurker",
          article_id: 1,
          votes: 0,
          created_at: "",
          body: "This is a test comment"
        };
        console.log(body[0]);
        expect(body[0]).to.contain.keys(Object.keys(templateComments));
        expect(body[0].comment_id).to.equal(templateComments.comment_id);
      }

      )
    });
  });
  describe('/comments/:comment_id', () => {
    it('PATCH:202', () => {
      return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1 })
      .expect(202)
      .then(({ body }) => {
        expect(body.votes).to.equal(17);
      });
    });
    it("PATCH:400 Bad Request", () => {
      return request(app)
        .patch("/api/comments/500")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
    it.only('DELETE:204', () => {
      return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(( {body} ) => {
        expect(body).to.deep.equal({});
      });
    });
  });
});
