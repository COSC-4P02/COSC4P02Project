// File
var fs = require('fs');

// Hooks-Server
const {
  add_filter,
  remove_filter,
  add_action,
  remove_action,
  do_action,
  apply_filters
} = require("./plugins/hooks-server/hooks-server.js");

// NLP
const readline = require('readline');
const { NlpManager } = require('./plugins/NlpManager');
const trainnlp = require('./nlp-train');
const threshold = 0.5;
const nlpManager = new NlpManager({ languages: ['en'] });

// WebSocket
const ws = require("./plugins/ws/index.js");
var wsport = 8001;

// Express
const express = require('express')
var cors = require('cors');
const app = express()
const webport = 3000

// CORS Allow Origins
var allowedOrigins = ['http://localhost:3000',
                      'https://chatbot-ai.ga',
                      'https://web.chatbot-ai.ga',
                      'https://web-test.chatbot-ai.ga',
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

// Console Log
function print(message) {
  console.log(message);
}

// Train NLP if not trained
(async () => {
  await trainnlp(nlpManager, print);
})();

// Define WSS
var options = {
  secure: true,
  key: fs.readFileSync("cert/key.pem"),
  cert: fs.readFileSync("cert/cert.pem")
}

// Define WebSocket
var server = ws.createServer(options, conn=> {
  print("New connection")
  
  conn.on("text", function (data) {
    print("Message Received")
    var obj = {};
    try {
      obj = JSON.parse(data);
    } catch(e) {
      print(e)
    }
    do_action(`received`,conn,obj);
    do_action(`received_${obj.type}`,conn,obj);
  })

  conn.on("close", function (code, reason) {
    print("Connection closed");
    do_action(`closed`,conn);
    do_action(`closed_${reason}`,conn);
  })
  
  conn.on("error",function(err){
    print('handler error'+err,err)
  })

}).listen(wsport)

// Receive message
// Reply with nlp answer
var receivedText = (conn,obj)=>{
  print(obj);
  (async () => {
    // Pocess NLP
    const result = await nlpManager.process(obj.msg);
    // Get Answer
    const answer = result.score > threshold && result.answer
      ? result.answer
      : "Sorry, I don't understand";

    // Reply to Client
    send = {
      'type': 'text',
      'text': answer,
      'disableInput': false
    }
    conn.sendText(JSON.stringify(send));

    // Sentiment
    let sentiment = '';
    if (result.sentiment.score !== 0) {
        sentiment = `  ${result.sentiment.score > 0 ? ':)' : ':('}   (${
        result.sentiment.score
      })`;
    }
    print(`bot> ${answer} ${sentiment}`);

  })();
};
add_action('received_text',receivedText);

print('WebSocket Chat Server Listening on Port ' + wsport);

// Api Services
app.get('/', (req, res) => {
  res.send('404 Not Found');
})

// User enter logs
app.get('/log/enter/', (req, res) => {
  print('A user is coming');
  res.send('{"type": "confirm","msg":"success"}');
})

app.listen(webport, () => {
  print(`Api Services listening on port ${webport}`)
})
