const fs = require("fs");

// Brock Programs

module.exports = function () {
  let rawdata = fs.readFileSync("train-data/brock/all_programs.json");
  let brockPrograms = JSON.parse(rawdata);
  return brockPrograms;
};
