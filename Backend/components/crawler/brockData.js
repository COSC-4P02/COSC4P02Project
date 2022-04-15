const fs = require("fs");

// Brock Data

module.exports = function () {
  let rawdata = fs.readFileSync("train-data/brock/brock-data.json");
  let brockData = JSON.parse(rawdata);
  return brockData;
};
