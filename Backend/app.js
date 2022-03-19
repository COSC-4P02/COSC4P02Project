/*!
 * Chatbot-ai Backend
 * Copyright 2021 chatbot-ai.ga
 * 
 * Available under the terms of the MIT
 * See LICENSE file for more informations.
 */

var config = require('./config');

// Hooks-Server
// const {add_filter, remove_filter, add_action, 
//   remove_action, do_action, apply_filters 
// } = require("./plugin/hooks-server/hooks-server.js");

// Logger
const { print, errorlog, chatlog } = require('./components/logService');

// DataBase
const { dbMain, dbCache } = require('./components/dbService');

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// NLP init
const { NlpManager } = require('node-nlp');
const trainnlp = require('./components/nlp-train/nlp-train');
const threshold = config.nlpThreshold;
const nlpManagerBrock = new NlpManager({ 
  languages: ['en'], 
  threshold: config.nlpThreshold,
  modelFileName: './data/nlp-model/model-brock.nlp',
  autoLoad: false,
  autoSave: true
});
const nlpManagerGame = new NlpManager({ 
  languages: ['en'],  
  threshold: config.nlpThreshold,
  modelFileName: './data/nlp-model/model-game.nlp',
  autoLoad: false,
  autoSave: true
});

// Train NLP if not trained
(async () => {
  await trainnlp(nlpManagerBrock, print, dbCache, "brock");
  await trainnlp(nlpManagerGame, print, dbCache, "game");
})();

// Store nlp data
var nlp_info = [ threshold, nlpManagerBrock, nlpManagerGame ];

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// WebSocket Service
const wsService = require('./components/wsService');
wsService(print, errorlog, chatlog, nlp_info, dbCache);

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// Api Service
const apiService = require('./components/apiService');
apiService(print, errorlog, dbCache);

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

let {PythonShell} = require('python-shell')
PythonShell.run('test/shell.py', null, function (err) {
  if (err){
    errorlog('Core: Python is not working correctly')
    throw err;
  } 
  print('Core: PythonShell is working correctly')
});

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

function exitHandler(options, exitCode) {
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

process.stdin.resume();
process.on('exit', exitHandler.bind(null,{cleanup:true}));
// ctrl+c
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
// kill pid
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
// uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
