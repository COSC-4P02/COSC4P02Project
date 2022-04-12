const assert = require("assert");
var http = require("http");

// Test DB
const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig.js");
var dbTest = new JsonDB(
  new Config("data/database/chatbot-data-test.cdb", true, false, "/")
);
function print(data) {}

describe("Python Shell Test", () => {
  it("should not return error msg", function (done) {
    this.skip();
    if (process.env.CI === "true" && process.env.CIRCLECI === "true") {
      this.skip();
    }
    let { PythonShell } = require("python-shell");
    PythonShell.run("test/shell.py", null, function (err) {
      if (err) done(err);
      done();
    });
  });
});
