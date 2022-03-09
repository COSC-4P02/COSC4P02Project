var config = {};

// WebSocket Port
config.WebSocketPort = 8001;

// Api Service Port
config.apiServicePort = 3000;

// Api Service CORS
config.corsAllowedOrigins = ['http://localhost:1901',
                        'https://chatbot-ai.ga',
                        'https://web.chatbot-ai.ga'];

// SSL Cert
config.wsKey = "cert/key.pem";
config.wsCert = "cert/cert.pem";

// Error Log Location
config.loggerError = "data/logs/chatbot-error.log";
config.loggerInfo = "data/logs/chatbot-info.log";

// NLP.JS
config.nlpThreshold = 0.5;

// Database Main Location
config.databaseLocMain = "data/database/chatbot-data-main.cdb";

// Database Temp Location
config.databaseLocCache = "data/database/chatbot-data-cache.cdb";

module.exports = config;