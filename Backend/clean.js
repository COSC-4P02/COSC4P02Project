const fs = require("fs");

const path = [
  "./data/logs/chatbot-error.log",
  "./data/logs/chatbot-info.log",
  "./data/nlp-model/model-brock.nlp",
  "./data/nlp-model/model-game.nlp",
  "./data/database/chatbot-data-test.cdb",
];
const folder = ["./data/nltk/corpora/", "./data/nltk/tokenizers/"];

function clean(path) {
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Cleaned: " + path);
  });
}

function clean_folder(path) {
  fs.rmdir(path, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Cleaned: ${path}`);
  });
}

path.forEach((path) => clean(path));
folder.forEach((path) => clean_folder(path));
