var config = require("../config");
var { stats_one, stats_array_append } = require("./statsService");

// Hooks-Server
/* eslint-disable */
const {
  add_filter,
  remove_filter,
  add_action,
  remove_action,
  do_action,
  apply_filters,
} = require("../plugin/hooks-server/hooks-server.js");
/* eslint-enable */

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// WebSocket
var fs = require("fs");
const ws = require("../plugin/ws/index.js");
var wsport = config.WebSocketPort;

// Define WSS
var options = {
  secure: true,
  key: fs.readFileSync(config.wsKey),
  cert: fs.readFileSync(config.wsCert),
};

module.exports = function (
  print,
  errorlog,
  chatlog,
  nlp_info,
  dbMain,
  dbCache
) {
  var threshold = nlp_info[0];
  var nlpManagerBrock = nlp_info[1];
  var nlpManagerGame = nlp_info[2];

  // Define WebSocket
  //var server =
  ws.createServer(options, (conn) => {
    stats_one(print, errorlog, dbMain, "ws/new");
    print("New Connection");

    conn.on("text", function (data) {
      print("Message Received");
      var obj = {};
      try {
        obj = JSON.parse(data);
      } catch (e) {
        print(e);
      }
      do_action(`received`, conn, obj);
      do_action(`received_${obj.type}_${obj.version}`, conn, obj);
    });

    conn.on("close", function (code, reason) {
      stats_one(print, errorlog, dbMain, "ws/close");
      print("Connection closed");
      do_action(`closed`, conn);
      do_action(`closed_${reason}`, conn);
    });

    conn.on("error", function (err) {
      stats_one(print, errorlog, dbMain, "ws/error");
      errorlog("WebSocket Error Occour - " + err);
    });
  }).listen(wsport);
  print("Core: WebSocket Server Listening on Port " + wsport);

  // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

  // Receive message
  // Brock
  var receivedTextBrock = (conn, obj) => {
    stats_one(print, errorlog, dbMain, "msg/receive/brock");
    (async () => {
      if (obj.extra == "news" && obj.msg != "Exit News Search") {
        const brockNews = require("./crawler/brockNews");
        brockNews(
          "search",
          obj.msg,
          0,
          dbMain,
          null,
          print,
          errorlog,
          function (all_news) {
            var send = {
              type: "news",
              text: "Here are some news about " + obj.msg,
              news: all_news,
              disableInput: false,
              options: [
                {
                  text: "Exit News Search",
                  value: "Exit News Search",
                  action: "postback",
                },
              ],
            };
            conn.sendText(JSON.stringify(send));
            return;
          }
        );

        // const test = require('./newsEngine/brockNewsEngine');
        // test(print,errorlog, obj.msg,function (data) {
        //   if (data=="notfound"){
        //     obj.extra="";
        //     receivedTextBrock(conn,obj)
        //   }else{
        //     //console.log(data);
        //     answer = data
        //     chatlog("Brock| User: " + obj.msg + " | Bot: " + answer);
        //     var send = { 'type': 'button', 'text': answer, 'disableInput': false, 'options': [
        //       {
        //         'text': 'Exit News Search',
        //         'value': 'Exit News Search',
        //         'action': 'postback'
        //       }
        //     ]}
        //     conn.sendText(JSON.stringify(send));
        //     return
        //   }
        // });
        return;
      }
      // Pocess NLP
      const result = await nlpManagerBrock.process(obj.msg);
      // Get Answer
      var answer =
        result.score > threshold && result.answer
          ? result.answer
          : '!json-{"type":"button","text":"Sorry, I don\'t understand, but maybe you can find answer here.","disableInput":false,"options":[{"text":"Find it out","value":"http://www.google.com/search?q=' +
            encodeURIComponent(obj.msg) +
            '","action":"url"}]}';
      var answer2 = (" " + answer).slice(1);

      if (!(result.score > threshold && result.answer)) {
        stats_one(print, errorlog, dbMain, "nlp/brock/noanswer");
        stats_array_append(
          print,
          errorlog,
          dbMain,
          "nlp/brock/noanswer",
          obj.msg
        );
      }

      chatlog("Brock| User: " + obj.msg + " | Bot: " + answer);

      function callback_conn(msg) {
        conn.sendText(msg);
      }
      var answerProcessBrock = require("../components/answerProcess/answerProcessBrock.js");
      answer = answerProcessBrock(
        obj,
        answer,
        callback_conn,
        dbMain,
        dbCache,
        print,
        errorlog
      );

      // Reply to Client by text
      var send = { type: "text", text: answer, disableInput: false };

      if (answer == "!ignore") {
        // Ignore this send
        return;
      } else if (answer == "!json") {
        // Send this json directly
        const param = answer2.substr(
          answer2.indexOf("-") + 1,
          answer2.length - 1
        );
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
  add_action("received_text_brock", receivedTextBrock);

  // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

  // Receive message
  // Canada Game
  var receivedTextGame = (conn, obj) => {
    stats_one(print, errorlog, dbMain, "msg/receive/game");
    (async () => {
      // Pocess NLP
      const result = await nlpManagerGame.process(obj.msg);
      // Get Answer
      var answer =
        result.score > threshold && result.answer
          ? result.answer
          : '!json-{"type":"button","text":"Sorry, I don\'t understand, but maybe you can find answer here.","disableInput":false,"options":[{"text":"Find it out","value":"http://www.google.com/search?q=' +
            encodeURIComponent(obj.msg) +
            '","action":"url"}]}';
      var answer2 = (" " + answer).slice(1);

      if (!(result.score > threshold && result.answer)) {
        stats_one(print, errorlog, dbMain, "nlp/game/noanswer");
        stats_array_append(
          print,
          errorlog,
          dbMain,
          "nlp/game/noanswer",
          obj.msg
        );
      }

      chatlog("Game| User: " + obj.msg + " | Bot: " + answer);

      // Process Answer if needed
      function callback_conn(msg) {
        conn.sendText(msg);
      }
      var answerProcessGame = require("../components/answerProcess/answerProcessGame.js");
      answer = answerProcessGame(
        obj,
        answer,
        callback_conn,
        dbMain,
        dbCache,
        print,
        errorlog
      );

      // Reply to Client by text
      var send = { type: "text", text: answer, disableInput: false };

      if (answer == "!ignore") {
        // Ignore this send
        return;
      } else if (answer == "!json") {
        // Send this json directly
        const param = answer2.substr(
          answer2.indexOf("-") + 1,
          answer2.length - 1
        );
        conn.sendText(param);
        return;
      }
      conn.sendText(JSON.stringify(send)); // Send to Client
    })();
  };
  add_action("received_text_game", receivedTextGame);
};
