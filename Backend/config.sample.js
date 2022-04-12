var config = {};

// WebSocket Port
config.WebSocketPort = 8001;

// Api Service Port
config.apiServicePort = 3000;

// Api Service CORS
config.corsAllowedOrigins = ["http://localhost:1901", "http://localhost:3010"];

// SSL Cert
config.wsKey = "cert/key.pem";
config.wsCert = "cert/cert.pem";

// Error Log Location
config.loggerInfo = "data/logs/chatbot-info.log";
config.loggerError = "data/logs/chatbot-error.log";

// NLP.JS
config.nlpThreshold = 0.5;

// Database Main Location
config.databaseLocMain = "data/database/chatbot-data-main.cdb";

// Database Temp Location
config.databaseLocCache = "data/database/chatbot-data-cache.cdb";

// Discord Bot Config
config.enableDiscord = 0;
config.discord = "";
config.discordBrock = "";
config.discordGame = "";

// Faceebook Bot Config
config.enableFB = 0;
config.FB_brock = {
  pageID: "",
  appID: "",
  appSecret: "",
  validationToken: "",
  pageToken: "",
};
config.FB_game = {
  pageID: "",
  appID: "",
  appSecret: "",
  validationToken: "",
  pageToken: "",
};

module.exports = config;
