var config = require("../data/config");

// Logger
const winston = require("winston");

// Create Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "Chatbot" },
  transports: [
    new winston.transports.File({
      filename: config.loggerError,
      level: "error",
    }),
    new winston.transports.File({ filename: config.loggerInfo }),
  ],
});

// Log to console
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

module.exports = {
  print: function (message) {
    logger.log({
      level: "info", // Level of the logging message
      message: message,
    });
  },
  errorlog: function (message) {
    logger.log({
      level: "error",
      message: message,
    });
  },
  chatlog: function (message) {
    logger.log({
      level: "info",
      message: message,
    });
  },
};
