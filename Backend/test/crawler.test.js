const assert = require("assert");

// Test DB
const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig.js");
var dbTest = new JsonDB(
  new Config("data/database/chatbot-data-test.cdb", true, false, "/")
);
function print(data) {}

const brockData = require("../components/crawler/brockData");

describe("Brock Data Read Test", () => {
  it("should return a list of courses data", function (done) {
    var data = brockData();
    if (Object.keys(data).length <= 0 || data == undefined) {
      done(new Error("Error"));
      return;
    }
    done();
  });
});

// const covidNiagara = require("../components/crawler/covidNiagara");

// describe("Niagara Covid Infomation Fetch Test", () => {
//   it("should return a string of covid infomation", function (done) {
//     covidNiagara(dbTest, print, print, function (data) {
//       if (
//         data.length <= 0 ||
//         data == undefined ||
//         !data.includes("Niagara Region") ||
//         typeof data != "string" ||
//         !data instanceof String
//       ) {
//         done(new Error("Error"));
//         return;
//       }
//       done();
//     });
//   });
// });

const brockNews = require("../components/crawler/brockNews");

describe("Brock News Test", () => {
  describe("RSS Test", () => {
    it("should return news list", function (done) {
      // Circle Ci Does not work with brock news api sometimes
      if (process.env.CI === "true" && process.env.CIRCLECI === "true")
        this.skip();
      this.timeout(10000);
      brockNews("rss", "", 0, dbTest, dbTest, print, print, function (rss) {
        data = rss["items"];
        if (data.length <= 0 || data == undefined) {
          done(new Error("Error"));
          return;
        }
        done();
      });
    });
  });

  describe("Search Test", () => {
    it("should return news list", function (done) {
      if (process.env.CI === "true" && process.env.CIRCLECI === "true")
        this.skip();
      this.timeout(10000);
      brockNews(
        "search",
        "brock",
        0,
        dbTest,
        dbTest,
        print,
        print,
        function (all_news) {
          data = all_news;
          if (data.length <= 0 || data == undefined) {
            done(new Error("Error"));
            return;
          }
          done();
        }
      );
    });
  });
});

const gameNews = require("../components/crawler/gameNews");

describe("Game News Test", () => {
  describe("Web Test", () => {
    it("should return news list", function (done) {
      if (process.env.CI === "true" && process.env.CIRCLECI === "true")
        this.skip();
      this.timeout(10000);
      gameNews(0, dbTest, dbTest, print, print, function (rss) {
        data = rss["items"];
        if (data.length <= 0 || data == undefined) {
          done(new Error("Error"));
          return;
        }
        done();
      });
    });
  });
});
