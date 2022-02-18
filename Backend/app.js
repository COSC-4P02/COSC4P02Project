/*!
 * Chatbot-ai Backend
 * Copyright 2021 chatbot-ai.ga
 * 
 * Available under the terms of the MIT
 * See LICENSE file for more informations.
 */

var config = require('./config');

// Hooks-Server
const {add_filter, remove_filter, add_action, 
  remove_action, do_action, apply_filters 
} = require("./plugins/hooks-server/hooks-server.js");

//Logger
const { print, errorlog, chatlog } = require('./components/logService');

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// NLP init
const readline = require('readline');
const { NlpManager } = require('./plugins/NlpManager');
const trainnlp = require('./components/nlp-train/nlp-train');
const threshold = config.nlpThreshold;
const nlpManagerBrock = new NlpManager({ languages: ['en'] });
const nlpManagerGame = new NlpManager({ languages: ['en'] });

// Train NLP if not trained
(async () => {
  await trainnlp(nlpManagerBrock, print, "brock");
  await trainnlp(nlpManagerGame, print, "game");
})();

// Store nlp data
var nlp_info = [ threshold, nlpManagerBrock, nlpManagerGame ];

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// WebSocket Service
const wsService = require('./components/wsService');
wsService(print, errorlog, chatlog, nlp_info);

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

// Api Service
const apiService = require('./components/apiService');
apiService(print, errorlog);
