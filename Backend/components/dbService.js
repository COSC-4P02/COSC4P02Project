var config = require('../config');

const { JsonDB } = require ('node-json-db');
const { Config } = require ('node-json-db/dist/lib/JsonDBConfig.js');
var dbMain = new JsonDB(new Config(config.databaseLocMain, true, false, '/'));
var dbCache = new JsonDB(new Config(config.databaseLocCache, true, false, '/'));
dbMain.push("/creator", "Krunk");
dbCache.push("/creator", "Krunk");
dbMain.push("/runtime", new Date());
dbCache.push("/runtime", new Date());

exports.dbMain = dbMain;
exports.dbCache = dbCache;