const assert = require("assert");
var http = require("http");

// Test DB
const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig.js");
var dbTest = new JsonDB(
  new Config("data/database/chatbot-data-test.cdb", true, false, "/")
);
function print(data) {}

const apiService = require("../components/apiService");

describe("Api Service Test", () => {
  before(function () {
    // NLP init
    const { NlpManager } = require("node-nlp");
    const trainnlp = require("../components/nlp-train/nlp-train");
    const threshold = 0.5;
    const nlpManagerBrock = new NlpManager({
      languages: ["en"],
      threshold: 0.5,
      modelFileName: "../data/nlp-model/model-brock.nlp",
      autoLoad: false,
      autoSave: true,
    });
    const nlpManagerGame = new NlpManager({
      languages: ["en"],
      threshold: 0.5,
      modelFileName: "../data/nlp-model/model-game.nlp",
      autoLoad: false,
      autoSave: true,
    });

    // Train NLP if not trained
    (async () => {
      await trainnlp(nlpManagerBrock, print, dbTest, "brock");
      await trainnlp(nlpManagerGame, print, dbTest, "game");
    })();

    // Store nlp data
    var nlp_info = [threshold, nlpManagerBrock, nlpManagerGame];
    apiService(print, print, dbTest, dbTest, print, nlp_info);
  });
  it("should return 200 - /", function (done) {
    http.get("http://localhost:3000", function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });
  it("should return 200 - Brock News", function (done) {
    if (process.env.CI === "true" && process.env.CIRCLECI === "true")
      this.skip();
    this.timeout(10000);
    http.get("http://localhost:3000/data/brock/news", function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });
  it("should return 200 - Brock News Cache", function (done) {
    if (process.env.CI === "true" && process.env.CIRCLECI === "true")
      this.skip();
    this.timeout(10000);
    http.get("http://localhost:3000/data/brock/news/cache", function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });
  it("should return 200 - Test Page", function (done) {
    http.get("http://localhost:3000/test", function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });
  it("should return 200 - News Search", function (done) {
    if (process.env.CI === "true" && process.env.CIRCLECI === "true")
      this.skip();
    this.timeout(10000);
    http.get(
      "http://localhost:3000/data/brock/news/search?s=brock",
      function (res) {
        assert.equal(200, res.statusCode);
        done();
      }
    );
  });
});

const brockNewsEngine = require("../components/newsEngine/brockNewsEngine");

describe("Brock News Python Test", () => {
  it("should return notfound when msg is not relevant", function (done) {
    this.skip();
    if (process.env.CI === "true" && process.env.CIRCLECI === "true")
      this.skip();
    this.timeout(100000);
    msg = "hello";
    brockNewsEngine(print, print, msg, function (data) {
      if (data == "notfound") {
        done();
      } else {
        done(new Error("Error"));
      }
    });
  });
  it("should return a text when brock is in the news", function (done) {
    this.skip();
    if (process.env.CI === "true" && process.env.CIRCLECI === "true")
      this.skip();
    this.timeout(100000);
    msg = "brock";
    brockNewsEngine(print, print, msg, function (data) {
      //console.log(data);
      if (data == "notfound") {
        done(new Error("Error"));
      } else {
        done();
      }
    });
  });
});
