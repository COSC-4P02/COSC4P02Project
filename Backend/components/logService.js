var config = require("../data/config");
const axios = require("axios").default;

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
  startlog: function (message) {
    if (process.env.NODE_ENV === "production") {
      console.log(message);
    }
    logger.log({
      level: "info",
      message: "Startlog: " + message,
    });
    try {
      axios
        .get(
          "https://api2.krunk.cn/chatbotai-api/chatbotNoti/chatbot-ai-private.php?payload=" +
            encodeURIComponent(
              "Chatbot-Ai Server Start#/" +
                message.replace("#", "_") +
                "#/Chatbot-Ai#/" +
                "https://chatbot-ai.ga" +
                "#/timeSensitive"
            )
        )
        .then(function () {
          console.log("Logger: Startlog Notification to Admin Success");
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (e) {
      console.error(e);
    }
  },
  errorlog: function (message) {
    if (process.env.NODE_ENV === "production") {
      console.error(message);
    }
    logger.log({
      level: "error",
      message: message,
    });
    try {
      axios
        .get(
          "https://api2.krunk.cn/chatbotai-api/chatbotNoti/chatbot-ai-private.php?payload=" +
            encodeURIComponent(
              "Chatbot-Ai Error#/" +
                message.replace("#", "_") +
                "#/Chatbot-Ai#/" +
                "https://chatbot-ai.ga" +
                "#/timeSensitive"
            )
        )
        .then(function () {
          console.log("Logger: Errorlog Notification to Admin Success");
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (e) {
      console.error(e);
    }
  },
  chatlog: function (message) {
    logger.log({
      level: "info",
      message: message,
    });
  },
};
