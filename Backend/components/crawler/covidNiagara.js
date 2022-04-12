const https = require("https");

// Niagara Covid Data

// const test = require('./components/crawler/covidNiagara');
// test(dbCache, print,errorlog,function (data) {
//  console.log(data);
// });

module.exports = function (dbCache, print, errorlog, result) {
  var sent = false;
  const db_loc = "/crawler/data/niagara/covid/data";
  const db_loc_date = "/crawler/data/niagara/covid/date";
  const cache_max_time = 6; // Max cache time (Hour)
  var data_cache;

  // Check Cache Date
  try {
    var data_cache_date = dbCache.getData(db_loc_date);
    const expire_timer = new Date(data_cache_date) - new Date();
    const expire_timer_format =
      "PassTime: " + ((expire_timer / 1000 / 60) * -1).toFixed(2) + " Min";
    if (expire_timer >= -1000 * 60 * 60 * cache_max_time) {
      data_cache = dbCache.getData(db_loc);
      print(
        "Crawler: Niagara Covid Read from database - " + expire_timer_format
      );
      result(data_cache);
      sent = true;
    } else {
      print("Crawler: Niagara Covid database expire - " + expire_timer_format);
    }
  } catch (e) {
    print("Crawler: No data from cache database - " + db_loc_date);
  }

  var options = {
    hostname: "niagara.krunk.cn",
    port: 443,
    path: "/today-api.php",
    method: "GET",
  };

  var req = https.request(options, (res) => {
    if (res.statusCode != 200) {
      console.error("Niagara COVID Fetch Api Error: " + res.statusCode);
      return;
    }
    res.on("data", (d) => {
      try {
        const data = JSON.parse(d);
        const result_data =
          "As of " +
          data["date"] +
          " in Niagara Region, Total Cases: " +
          data["strCaseNumbers"] +
          ", Total Resolved Cases: " +
          data["spnResolvedCases"] +
          ", Total Death Cases: " +
          data["death"];

        dbCache.push(db_loc, result_data);
        dbCache.push(db_loc_date, new Date());
        print("Crawler: Niagara Covid Fetch Successfully | Saved to database");

        if (!sent) result(result_data);
      } catch (e) {
        errorlog("Niagara COVID Fetch Api Error: " + e);
        if (!sent && data_cache != null) result(data_cache);
        return;
      }
    });
  });

  req.on("error", (error) => {
    console.error("Niagara COVID Fetch Api Error: " + error);
    if (!sent && data_cache != null) result(data_cache);
  });

  req.end();
};
