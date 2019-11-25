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
  describe("/non-existent-route", () => {
    it("GET:404 non exsistant route", () => {
      return request(app)
        .get("/non-existent-route")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });
  });
  describe("/api", () => {
    it("DELETE:405 ", () => {
      return request(app)
        .delete("/api")
        .expect(405)
        .then(body => {
          expect(body.text).to.equal("Method Not Found");
        });
    });
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
    it("GET:405 Method Not Found", () => {
      return request(app)
        .patch("/api/topics")
        .send({})
        .expect(405)
        .then(body => {
          expect(body.text).to.equal("Method Not Found");
        });
    });
  });
  describe("/users/:username", () => {
    it("GET:200 returns specified user object", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).to.include.keys("username", "avatar_url", "name");
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
    it("Get:404 Not Found", () => {
      return request(app)
        .get("/api/users")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });
    it("PUT:405 Method Not Found", () => {
      return request(app)
        .put("/api/users/butter_bridge")
        .send({})
        .expect(405)
        .then(body => {
          expect(body.text).to.equal("Method Not Found");
        });
    });
  });
  describe("/articles", () => {
    it("GET:200 Sorted by created_at,desc by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(+articles[0].created_at.slice(0, 4)).to.be.greaterThan(
            +articles[articles.length - 1].created_at.slice(0, 4)
          );
        });
    });
    it("PATCH:405 Method Not Found ", () => {
      return request(app)
        .patch("/api/articles")
        .send()
        .expect(405)
        .then(body => {
          expect(body.text).to.equal("Method Not Found");
        });
    });
    it("GET:200 Sorted by article_id, asc", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(+articles[0].article_id).to.be.lessThan(
            +articles[articles.length - 1].article_id
          );
        });
    });
    it("GET:200 filtered by author", () => {
      return request(app)
        .get("/api/articles?author=icellusedkars")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0].author).to.equal("icellusedkars");
          expect(articles[3].author).to.equal("icellusedkars");
          expect(articles[articles.length - 1].author).to.equal(
            "icellusedkars"
          );
        });
    });
    it("GET:200 filtered by topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0].topic).to.equal("mitch");
          expect(articles[3].topic).to.equal("mitch");
          expect(articles[articles.length - 1].topic).to.equal("mitch");
        });
    });
    it("GET:400 Bad Request sorted by non existant column", () => {
      return request(app)
        .get("/api/articles?sort_by=not-a-column")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request");
        });
    });
    it("GET:404 Not found filtered by non existant topic", () => {
      return request(app)
        .get("/api/articles?topic=NotATopic")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Not Found");
        });
    });
    it("GET:404 Not found filtered by non existant author", () => {
      return request(app)
        .get("/api/articles?author=NotAUser") //icellusedkars
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Not Found");
        });
    });
    it("GET:200 filtered by existant author with no articles", () => {
      return request(app)
        .get("/api/articles?author=lurker")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.deep.equal([]);
        });
    });
  });
  describe("/articles/:article_id", () => {
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
        .then(({ body: { article } }) => {
          expect(article).to.contain.keys(Object.keys(testArticle));
        });
    });
    it("PATCH:200 return updated object", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.votes).to.equal(101);
        });
    });
    it("GET:400 if invalid id", () => {
      return request(app)
        .get("/api/articles/banan")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
    it("PATCH:200 return unopdated object if no body passed", () => {
      return request(app)
        .patch("/api/articles/1")
        .send()
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.votes).to.equal(100);
        });
    });
    it("PATCH:404 Not Found", () => {
      return request(app)
        .patch("/api/articles/500")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });
    it("PUT:405 Method Not Found ", () => {
      return request(app)
        .put("/api/articles/1")
        .send()
        .expect(405)
        .then(body => {
          expect(body.text).to.equal("Method Not Found");
        });
    });
  });
  describe("/articles/:article_id/comments", () => {
    it("GET:200 returns array of comment objects", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
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
    it("GET:200 returns empty array of comment if no comments exsist on the article", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.deep.equal([]);
        });
    });
    it("GET:200 Sorted by votes,desc by default", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=votes")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(+comments[0].votes).to.be.greaterThan(
            +comments[comments.length - 1].votes
          );
        });
    });
    it("GET:200 Sorted by votes,asc", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=votes&order=asc")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(+comments[0].votes).to.be.lessThan(
            +comments[comments.length - 1].votes
          );
        });
    });
    it("GET:404 Not Found when valid ID not found", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });
    it("GET:400 Bad Request when not valid ID", () => {
      return request(app)
        .get("/api/articles/banan/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
    it("POST:201", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "lurker", body: "This is a test comment" })
        .expect(201)
        .then(({ body: { comment } }) => {
          const templateComments = {
            comment_id: 19,
            author: "lurker",
            article_id: 1,
            votes: 0,
            created_at: "",
            body: "This is a test comment"
          };
          expect(comment).to.contain.keys(Object.keys(templateComments));
          expect(comment.comment_id).to.equal(templateComments.comment_id);
        });
    });
    it("POST:400 Bad Request when data not provided", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
    it("POST:404 Not Found valid id not found", () => {
      return request(app)
        .post("/api/articles/1000/comments")
        .send({ username: "lurker", body: "This is a test comment" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });
    it("PUT:405", () => {
      return request(app)
        .put("/api/articles/1/comments")
        .send({ username: "lurker", body: "This is a test comment" })
        .expect(405)
        .then(body => {
          expect(body.text).to.equal("Method Not Found");
        });
    });
  });
  describe("/comments/:comment_id", () => {
    it("PATCH:202", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).to.equal(17);
        });
    });
    it("GET:405 Method Not Found", () => {
      return request(app)
        .put("/api/comments/1")
        .send({})
        .expect(405)
        .then(body => {
          expect(body.text).to.equal("Method Not Found");
        });
    });
    it("PATCH:404 Bad Request", () => {
      return request(app)
        .patch("/api/comments/500")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });
    it("PATCH:200 return unupdated obj if no body given", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({})
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).to.equal(16);
        });
    });
    it("DELETE:204", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).to.deep.equal({});
        });
    });
    it("DELETE:404 valid non existant id  ", () => {
      return request(app)
        .delete("/api/comments/1000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });
    it("DELETE:405 not valid id  ", () => {
      return request(app)
        .delete("/api/comments/banan")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
  });
});
