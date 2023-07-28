/*
 * +----------------------------------------+
 * |                                        |
 * |           Chatbot-Ai Backend           |
 * |                                        |
 * |      Copyright 2022 chatbot-ai.gq      |
 * |                                        |
 * |  Available under the terms of the MIT  |
 * | See LICENSE file for more informations |
 * |                                        |
 * +----------------------------------------+
 */

const init = require("./components/dataInit");
init();

var config = require("./data/config");

// Logger
const {
  print,
  errorlog,
  chatlog,
  startlog,
} = require("./components/logService");
if (process.env.NODE_ENV === "production")
  startlog("UTC Time: " + new Date().toUTCString());

// Stats Logger
var {
  stats_one,
  stats_query,
  stats_array_append,
} = require("./components/statsService");

// DataBase
const { dbMain, dbCache } = require("./components/dbService");

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// NLP init
const { NlpManager } = require("node-nlp");
const trainnlp = require("./components/nlp-train/nlp-train");
const threshold = config.nlpThreshold;
const nlpManagerBrock = new NlpManager({
  languages: ["en"],
  threshold: config.nlpThreshold,
  modelFileName: "./data/nlp-model/model-brock.nlp",
  autoLoad: false,
  autoSave: true,
});
const nlpManagerGame = new NlpManager({
  languages: ["en"],
  threshold: config.nlpThreshold,
  modelFileName: "./data/nlp-model/model-game.nlp",
  autoLoad: false,
  autoSave: true,
});

// Train NLP if not trained
(async () => {
  await trainnlp(nlpManagerBrock, print, dbCache, "brock");
  await trainnlp(nlpManagerGame, print, dbCache, "game");
})();

// Store nlp data
var nlp_info = [threshold, nlpManagerBrock, nlpManagerGame];

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// WebSocket Service
const wsService = require("./components/wsService");
wsService(print, errorlog, chatlog, nlp_info, dbMain, dbCache);

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// Api Service
const apiService = require("./components/apiService");
apiService(print, errorlog, dbMain, dbCache, chatlog, nlp_info);

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// Discord Service
if (config.enableDiscord) {
  const discordService = require("./components/discordService");
  discordService(print, errorlog, chatlog, nlp_info, dbMain, dbCache);
}

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// let {PythonShell} = require('python-shell')
// PythonShell.run('test/shell.py', null, function (err) {
//   if (err){
//     errorlog('Core: Python is not working correctly')
//     throw err;
//   }
//   print('Core: PythonShell is working correctly')
// });

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

function exitHandler(options, exitCode) {
  if (options.cleanup) console.log("clean");
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
}

process.stdin.resume();
process.on("exit", exitHandler.bind(null, { cleanup: true }));
// ctrl+c
process.on("SIGINT", exitHandler.bind(null, { exit: true }));
// kill pid
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
// uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));

stats_one(print, errorlog, dbMain, "core/server/start");
