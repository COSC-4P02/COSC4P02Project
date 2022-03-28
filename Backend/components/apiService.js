var config = require('../config');
const express = require('express')
var cors = require('cors');
var fs = require('fs');
var {stats_one,stats_query,stats_array_query} = require('./statsService');

module.exports = function (print, errorlog, dbMain, dbCache) { 
  // Express
  const app = express()
  const webport = config.apiServicePort

  // CORS Allow Origins
  var allowedOrigins = config.corsAllowedOrigins;
  app.use(cors({
    origin: function(origin, callback){
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Api Services
  app.get('/', (req, res) => {
    stats_one(print, errorlog, dbMain, "api/404");
    res.send('404 Not Found');
  })

  app.get('/stats/query', (req, res) => {
    stats_one(print, errorlog, dbMain, "api/stats/query");
    var query = req.query.q
    const s = stats_query(print, errorlog, dbMain, query);
    res.send(""+s);
  })

  app.get('/stats_array/query', (req, res) => {
    stats_one(print, errorlog, dbMain, "api/stats/query");
    var query = req.query.q
    const s = stats_array_query(print, errorlog, dbMain, query);
    res.setHeader('Content-Type', 'application/json');
    res.send(""+s);
  })

  app.get('/test', (req, res) => {
    stats_one(print, errorlog, dbMain, "api/test");
    res.send(fs.readFileSync('test/question-test.html').toString());
  })

  // Chatlog PDF
  app.post('/chat/pdf/', (req, res) => {
    stats_one(print, errorlog, dbMain, "api/chat/pdf");
    const chatlog = JSON.parse(req.body.chatlog)
    //console.log(chatlog);
    var result = "";
    for (var i = 0; i < chatlog.length; i++) {
      //console.log(chatlog[i]);
      result = result + chatlog[i]['agent'] + ': \t' + chatlog[i]['text'] + '\n'
      if (chatlog[i]['type'] == 'button'){
        for (var j = 0; j < chatlog[i]['options'].length; j++) {
          var value = ""
          if (chatlog[i]['options'][j]['value'] != undefined){
            value = chatlog[i]['options'][j]['value']
          }
          result = result + '\t> ' + chatlog[i]['options'][j]['text'] + '\t' + value + '\n'
        }
      }
    }
    var send = {'type': 'pdf', 'msg': result}
    print(send)
    res.send(JSON.stringify(send));
  })

  app.get('/data/brock/news', (req, res) => {
    const brockNews = require('./crawler/brockNews');
    brockNews('rss', '', 0, dbMain, dbCache, print, errorlog, function (rss) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(rss));
    });
  })

  // app.get('/data/brock/news/all', (req, res) => {
  //   const brockNews = require('./crawler/brockNews');
  //   brockNews('all', '', 0, dbMain, dbCache, print, errorlog, function (rss) {
  //     res.setHeader('Content-Type', 'application/json');
  //     res.send(JSON.stringify(rss));
  //   });
  // })

  app.get('/data/brock/news/cache', (req, res) => {
    const brockNews = require('./crawler/brockNews');
    brockNews('rss', '', 1, dbMain, dbCache, print, errorlog, function (rss) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(rss));
    });
  })

  // app.get('/data/brock/news/all/cache', (req, res) => {
  //   const brockNews = require('./crawler/brockNews');
  //   brockNews('all', '', 1, dbMain, dbCache, print, errorlog, function (rss) {
  //     res.setHeader('Content-Type', 'application/json');
  //     res.send(JSON.stringify(rss));
  //   });
  // })

  app.get('/data/brock/news/search', (req, res) => {
    const brockNews = require('./crawler/brockNews');
    brockNews('search', req.query.s, 0, dbMain, dbCache, print, errorlog, function (rss) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(rss));
    });
  })

  app.listen(webport, () => {
    stats_one(print, errorlog, dbMain, "api/service/start");
    print(`Core: Api Services listening on port ${webport}`)
  })
};