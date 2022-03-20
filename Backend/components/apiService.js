var config = require('../config');
const express = require('express')
var cors = require('cors');
var fs = require('fs');

module.exports = function (print, errorlog, dbCache) { 
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
    res.send('404 Not Found');
    //errorlog('/ visit');
  })

  app.get('/test', (req, res) => {
    res.send(fs.readFileSync('test/question-test.html').toString());
  })

  // User enter logs
  app.get('/log/enter/', (req, res) => {
    print('A user is coming');
    res.send('{"type": "confirm","msg":"success"}');
  })

  // Chatlog PDF
  app.post('/chat/pdf/', (req, res) => {
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
    var send = {'type': 'pdf',
            'msg': result}
    print(send)
    res.send(JSON.stringify(send));
  })

  app.get('/data/brock/news', (req, res) => {
    const brockNews = require('./crawler/brockNews');
    brockNews(dbCache, print, errorlog, function (rss) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(rss));
    });
  })

  app.listen(webport, () => {
    print(`Core: Api Services listening on port ${webport}`)
  })
};