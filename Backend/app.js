/*!
 * Chatbot-ai Backend
 * Copyright 2021 chatbot-ai.ga
 * 
 * Available under the terms of the MIT
 * See LICENSE file for more informations.
 */

// Logger
const winston = require('winston');

// Create Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'Chatbot' },
  transports: [
    new winston.transports.File({ filename: 'logs/chatbot-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/chatbot-info.log' })
  ]
});

// Log to console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Console Log
function print(message) {
  logger.log({
    level: 'info', // Level of the logging message
    message: message 
  });
}

function errorlog(message) {
  logger.log({
    level: 'error',
    message: message 
  });
}

function chatlog(message) {
  logger.log({
    level: 'info',
    message: message 
  });
}

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// File
var fs = require('fs');

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// Hooks-Server
const {add_filter, remove_filter, add_action, 
  remove_action, do_action, apply_filters 
} = require("./plugins/hooks-server/hooks-server.js");

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// NLP
const readline = require('readline');
const { NlpManager } = require('./plugins/NlpManager');
const trainnlp = require('./componments/nlp-train');
const threshold = 0.5;
const nlpManager = new NlpManager({ languages: ['en'] });

// Train NLP if not trained
(async () => {
  await trainnlp(nlpManager, print);
})();

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// WebSocket
const ws = require("./plugins/ws/index.js");
var wsport = 8001;

// Express
const express = require('express')
var cors = require('cors');
const app = express()
const webport = 3000

// CORS Allow Origins
var allowedOrigins = ['http://localhost:1901',
                      'https://chatbot-ai.ga',
                      'https://web.chatbot-ai.ga',
                      'https://ws.chatbot-ai.ga'];
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
app.use(express.urlencoded());

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// Define WSS
var options = {
  secure: true,
  key: fs.readFileSync("cert/key.pem"),
  cert: fs.readFileSync("cert/cert.pem")
}

// Define WebSocket
var server = ws.createServer(options, conn=> {
  print("New Connection")
  
  conn.on("text", function (data) {
    print("Message Received")
    var obj = {};
    try {
      obj = JSON.parse(data);
    } catch(e) {
      print(e)
    }
    do_action(`received`,conn,obj);
    do_action(`received_${obj.type}_${obj.version}`,conn,obj);
  })

  conn.on("close", function (code, reason) {
    print("Connection closed");
    do_action(`closed`,conn);
    do_action(`closed_${reason}`,conn);
  })
  
  conn.on("error",function(err){
    print('handler error'+err,err)
    errorlog("WebSocket Error Occour - " + err);
  })

}).listen(wsport)
print('WebSocket Chat Server Listening on Port ' + wsport);

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// Receive message
// Brock
var receivedTextBrock = (conn,obj)=>{
  (async () => {
    // Pocess NLP
    const result = await nlpManager.process(obj.msg);
    // Get Answer
    var answer = result.score > threshold && result.answer
      ? result.answer
      : '!json-{"type":"button","text":"Sorry, I don\'t understand, but maybe you can find answer here.","disableInput":false,"options":[{"text":"Find it out","value":"http://www.google.com/search?q='+encodeURIComponent(obj.msg)+'","action":"url"}]}';
    var answer2 = (' ' + answer).slice(1);

    chatlog("User: " + obj.msg + " | Bot: " + answer);

    // Process Answer if needed
    answer = apply_filters("answer_process", {answer,conn});

    // Reply to Client by text
    send = { 'type': 'text', 'text': answer, 'disableInput': false }

    if (answer == "!ignore"){ // Ignore this send
      return;
    }else if (answer == "!json"){ // Send this json directly
      const param = answer2.substr(answer2.indexOf('-')+1,answer2.length-1);
      conn.sendText(param);
      return;
    }
    conn.sendText(JSON.stringify(send)); // Send to Client

    // Sentiment
    // let sentiment = '';
    // if (result.sentiment.score !== 0) {
    //     sentiment = `  ${result.sentiment.score > 0 ? ':)' : ':('}   (${
    //     result.sentiment.score
    //   })`;
    // }
    // print(`bot> ${answer} : ${sentiment}`);

  })();
};
add_action('received_text_brock',receivedTextBrock);

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// Process answer if needs an action "!"
var answerProcess = require('./componments/answerProcess.js');
add_filter('answer_process',answerProcess);

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// Receive message
// Canada Game
var receivedTextGame = (conn,obj)=>{
  (async () => {
    // Reply to Client
    send = {
      'type': 'text',
      'text': 'Still under development...',
      'disableInput': false
    }
    conn.sendText(JSON.stringify(send));
  })();
};
add_action('received_text_game',receivedTextGame);

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// Api Services
app.get('/', (req, res) => {
  res.send('404 Not Found');
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
  send = {'type': 'pdf',
          'msg': result}
  print(send)
  res.send(JSON.stringify(send));
})

app.listen(webport, () => {
  print(`Api Services listening on port ${webport}`)
})
