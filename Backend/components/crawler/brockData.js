const https = require('https');
const fs = require('fs');

// Brock Data

// const test = require('./components/crawler/brockData');
// test(dbCache, print,errorlog,function (data) {
//  console.log(data);
// });

module.exports = function (dbCache, print, errorlog, result) { 

	let rawdata = fs.readFileSync('data/train-data/brock/brock-data.json');
	let brockData = JSON.parse(rawdata);
	//console.log(brockData);
	result(brockData);

}