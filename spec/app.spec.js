process.env.NODE_ENV = "test";
const request = require("supertest");
const { expect } = require("chai");
const connection = require("../db/connection");
const app = require('../app');

describe("/api", () => {
  after(() => {
    return connection.destroy();
  });
  describe("/topics", () => {
    it("GET:200", () => {
       return  request(app)
       .get("/api/topics")
       .expect(200)
    });
  });
});
