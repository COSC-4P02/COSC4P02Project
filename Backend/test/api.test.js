const assert = require('assert');
var http = require('http');

// Test DB
const { JsonDB } = require ('node-json-db');
const { Config } = require ('node-json-db/dist/lib/JsonDBConfig.js');
var dbTest = new JsonDB(new Config("data/database/chatbot-data-test.cdb", true, false, '/'));
function print(data){};

const apiService = require('../components/apiService');

describe('Api Service Test', () => {
  before(function () {
    apiService(print, print, dbTest);
  });
  it('should return 200', function (done) {
    http.get('http://localhost:3000', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });
  it('should return 200', function (done) {
    http.get('http://localhost:3000/data/brock/news', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });
  it('should return 200', function (done) {
    http.get('http://localhost:3000/data/brock/news/cache', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });
  it('should return 200', function (done) {
    http.get('http://localhost:3000/test', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });
});

const brockNewsEngine = require('../components/newsEngine/brockNewsEngine');

describe('Brock News Python Test', () => {
  it('should return notfound when msg is not relevant', function (done) {
    if (process.env.CI === 'true' && process.env.CIRCLECI === 'true'){
      this.skip();
    }
    this.timeout(100000);
    msg = "hello";
    brockNewsEngine(print,print, msg,function (data) {
      if (data=="notfound"){
        done();
      }else{
        done(new Error("Error"));
      }
    });
  });
  it('should return a text when brock is in the news', function(done) {
    if (process.env.CI === 'true' && process.env.CIRCLECI === 'true'){
      this.skip();
    }
    this.timeout(100000);
    msg = "brock";
    brockNewsEngine(print,print, msg,function (data) {
      //console.log(data);
      if (data=="notfound"){
        done(new Error("Error"));
      }else{
        done();
      }
    });
  });
});