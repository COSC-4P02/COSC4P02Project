var config = require('../config');
var {stats_one, stats_array_append} = require('./statsService');
const Discord = require("discord.js");

function sending(msg,message,chatlog){
  msg = JSON.parse(msg);
  if (msg.type === "button"){
    for (const e in msg.options){
      if (msg.options[e].action === "url")
        msg.text = msg.text + "\n" + msg.options[e].text + ": " + msg.options[e].value
      if (msg.options[e].action === "postback")
        msg.text = msg.text + "\nAsk Me: " + msg.options[e].text
    }
  }
  message.reply(msg.text);
  chatlog("Brock| User: " + message.content + " | Bot: " + msg.text);
}

module.exports = function (print, errorlog, chatlog, nlp_info, dbMain, dbCache) {
  var threshold = nlp_info[0];
  var nlpManagerBrock = nlp_info[1];
  var nlpManagerGame = nlp_info[2];
  
  const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});
  const prefix = "!";

  client.on("messageCreate", async function(message) {
    try{
      if (message.author.bot) return;

      const commandBody = message.content.slice(prefix.length);
      const args = commandBody.split(' ');
      const command = args.shift().toLowerCase();
      var check = "";
      if (command === "brock" || message.channelId === config.discordBrock){
        if (command === "brock")
          message.content = message.content.substring(7);
        check = 'brock';
        stats_one(print, errorlog, dbMain, "discord/msg");
      }else if (command === "game" || message.channelId === config.discordGame){
        if (command === "game")
          message.content = message.content.substring(6);
        check = 'game';
        stats_one(print, errorlog, dbMain, "discord/msg");
      }

      if (check === 'brock') { //Brock
        stats_one(print, errorlog, dbMain, "msg/receive/brock");
        const result = await nlpManagerBrock.process(message.content);
        var answer = result.score > threshold && result.answer
            ? result.answer
            : 'Sorry, I don\'t understand.';
        var answer2 = (' ' + answer).slice(1);

        if (!(result.score > threshold && result.answer)){
          stats_one(print, errorlog, dbMain, "nlp/brock/noanswer");
          stats_array_append(print, errorlog, dbMain, "nlp/brock/noanswer", obj.msg);
        }
        var obj={};
        obj.msg=message.content;
        var answerProcessBrock = require('./answerProcess/answerProcessBrock.js');
        answer = answerProcessBrock(obj,answer,function (msg){
          msg = JSON.parse(msg);
          if (msg.type === "button"){
            for (const e in msg.options){
              if (msg.options[e].action === "url")
                msg.text = msg.text + "\n" + msg.options[e].text + ": " + msg.options[e].value
              if (msg.options[e].action === "postback")
                msg.text = msg.text + "\nAsk Me: " + msg.options[e].text
            }
          }
          message.reply(msg.text);
          chatlog("Brock| User: " + message.content + " | Bot: " + msg.text);
        },dbCache,print,errorlog);
        if (answer == "!ignore"){ // Ignore this send
            return;
        }else if (answer == "!json"){ // Send this json directly
          const param = answer2.substr(answer2.indexOf('-')+1,answer2.length-1);
          sending(param,message,chatlog);
          return;
        }
        chatlog("Brock| User: " + message.content + " | Bot: " + answer);
        message.reply(answer);
        return;
      }else if (check === 'game') { //Game
        stats_one(print, errorlog, dbMain, "msg/receive/game");
        const result = await nlpManagerGame.process(message.content);
        answer = result.score > threshold && result.answer
            ? result.answer
            : 'Sorry, I don\'t understand.';
        answer2 = (' ' + answer).slice(1);

        if (!(result.score > threshold && result.answer)){
          stats_one(print, errorlog, dbMain, "nlp/brock/noanswer");
          stats_array_append(print, errorlog, dbMain, "nlp/brock/noanswer", obj.msg);
        }
        obj={};
        obj.msg=message.content;
        var answerProcessGame = require('./answerProcess/answerProcessGame.js');
        answer = answerProcessGame(obj,answer,function (msg){
          msg = JSON.parse(msg);
          if (msg.type === "button"){
            for (const e in msg.options){
              if (msg.options[e].action === "url")
                msg.text = msg.text + "\n" + msg.options[e].text + ": " + msg.options[e].value
              if (msg.options[e].action === "postback")
                msg.text = msg.text + "\nAsk Me: " + msg.options[e].text
            }
          }
          message.reply(msg.text);
          chatlog("Game| User: " + message.content + " | Bot: " + msg.text);
        },dbCache,print,errorlog);
        if (answer == "!ignore"){ // Ignore this send
            return;
        }else if (answer == "!json"){ // Send this json directly
          const param = answer2.substr(answer2.indexOf('-')+1,answer2.length-1);
          sending(param,message,chatlog)
          return;
        }
        chatlog("Game| User: " + message.content + " | Bot: " + answer);
        message.reply(answer);
        return;
      }

      if (!message.content.startsWith(prefix)) return;
      if (command === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
      }
    }catch(e){
      errorlog("Discord: Send Error "+e)
    }
  });

  if (config.discord != ""){
    try{
      client.login(config.discord);
      print('Core: Discord Bot Backend is Listening')
    }catch(e){
      errorlog("Discord: Login Error "+e)
    }
  }
};
