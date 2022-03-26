const assert = require('assert');

// Test DB
const { JsonDB } = require ('node-json-db');
const { Config } = require ('node-json-db/dist/lib/JsonDBConfig.js');
var dbTest = new JsonDB(new Config("data/database/chatbot-data-test.cdb", true, false, '/'));
function print(data){};

const brockData = require('../components/crawler/brockData');

describe('Brock Data Read Test', () => {
  it('should return a list of courses data', function(done) {
    brockData(dbTest, print,print,function (data) {
      if (Object.keys(data).length <= 0 || data == undefined){
        done(new Error("Error"));
        return;
      }
      done();
    });
  });
});

const covidNiagara = require('../components/crawler/covidNiagara');

describe('Niagara Covid Infomation Fetch Test', () => {
  it('should return a string of covid infomation', function(done) {
    covidNiagara(dbTest, print,print,function (data) {
      if (data.length <= 0 || data == undefined || !data.includes("Niagara Region") || 
        (typeof data != 'string' || !data instanceof String)){
        done(new Error("Error"));
        return;
      }
      done();
    });
  });
});

const brockNews = require('../components/crawler/brockNews');

describe('brockNews Test', () => {
  it('should return news list', function(done) {
    this.timeout(10000);
    brockNews('rss', '', 0, dbTest, print, print, function (rss) {
      data = rss['items'];
      if (data.length <= 0 || data == undefined){
        done(new Error("Error"));
        return;
      }
      done();
    });
  });
});
