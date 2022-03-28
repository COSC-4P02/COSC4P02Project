// stats_one(print, errorlog, dbMain, "chat/pdf");
function stats_one(print, errorlog, dbMain, db_stats) {
  db_stats = "/stats/"+db_stats
  try{
    var db_stats_data = dbMain.getData(db_stats);
    if (db_stats_data >= 0){
      dbMain.push(db_stats, db_stats_data+1);
    }else{
      dbMain.push(db_stats, 1);
    }
  }catch(e){
    dbMain.push(db_stats, 1);
  }
}

function stats_query(print, errorlog, dbMain, db_stats) {
  db_stats = "/stats/"+db_stats
  try{
    var db_stats_data = dbMain.getData(db_stats);
    if (db_stats_data >= 0){
      return db_stats_data;
    }else{
      return 0;
    }
  }catch(e){
    return 0;
  }
}

function stats_array_query(print, errorlog, dbMain, db_stats) {
  db_stats = "/stats_array/"+db_stats
  try{
    var db_stats_data = dbMain.getData(db_stats);
    return JSON.stringify(db_stats_data);
  }catch(e){
    return "{}";
  }
}

function stats_array_append(print, errorlog, dbMain, db_stats, data) {
  db_stats = "/stats_array/"+db_stats
  var db_stats_data = {};
  try{
    db_stats_data = dbMain.getData(db_stats);
    if (db_stats_data[data]>=0) {
      db_stats_data[data] = db_stats_data[data] + 1
    }else{
      db_stats_data[data] = 1
    }
    dbMain.push(db_stats, db_stats_data);
  }catch(e){
    db_stats_data = {};
    db_stats_data[data] = 1
    dbMain.push(db_stats, db_stats_data);
  }
}

module.exports = {
    stats_one,
    stats_query,
    stats_array_append,
    stats_array_query
}