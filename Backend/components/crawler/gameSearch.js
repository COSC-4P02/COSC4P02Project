const axios = require("axios").default;
var { stats_one } = require("../statsService");

// Game Search

function requestSearch(
  cx,
  cse_token,
  api,
  parma,
  errorlog,
  result,
  print,
  dbCache
) {
  var all_searchs = [];
  print(
    "Crawler: cx_url - " +
      "https://cse.google.com/cse/element/v1?rsz=filtered_cse&num=10&hl=en&source=gcsc&gss=.ca&cselibv=3e1664f444e6eb06&cx=" +
      cx +
      "&q=" +
      encodeURIComponent(parma.replace(" ", "+")) +
      "&safe=off&cse_tok=" +
      cse_token +
      "&exp=csqr,cc,4742718&callback=google.search.cse.api" +
      api
  );
  axios
    .get(
      "https://cse.google.com/cse/element/v1?rsz=filtered_cse&num=10&hl=en&source=gcsc&gss=.ca&cselibv=3e1664f444e6eb06&cx=" +
        cx +
        "&q=" +
        encodeURIComponent(parma.replace(" ", "+")) +
        "&safe=off&cse_tok=" +
        cse_token +
        "&exp=csqr,cc,4742718&callback=google.search.cse.api" +
        api
    )
    .then(function (res) {
      var data = JSON.parse(
        res.data
          .replace("/*O_o*/", "")
          .replace("google.search.cse.api" + api + "(", "")
          .replace(");", "")
      );

      if ("error" in data) {
        errorlog("Crawler: Game Search Error - " + parma);
        result([]);
        return;
      }

      if (!("results" in data)) {
        print("Crawler: Game Search Not Found - " + parma);
        result([]);
        const db_search_loc =
          "/crawler/data/game/search/array/" +
          encodeURIComponent(parma.replace(" ", "+").replace("/", ""));
        dbCache.push(db_search_loc, []);
        return;
      }

      var first = data["results"][0];

      delete first["cacheUrl"];
      delete first["clicktrackUrl"];
      delete first["visibleUrl"];
      delete first["breadcrumbUrl"];
      delete first["content"];
      delete first["title"];
      delete first["formattedUrl"];

      all_searchs.push(first);

      if (data["results"].length > 1) {
        first = data["results"][1];

        delete first["cacheUrl"];
        delete first["clicktrackUrl"];
        delete first["visibleUrl"];
        delete first["breadcrumbUrl"];
        delete first["content"];
        delete first["title"];
        delete first["formattedUrl"];
      }

      all_searchs.push(first);
      print("Crawler: Game Search - " + parma);
      result(all_searchs);
      const db_search_loc =
        "/crawler/data/game/search/array/" +
        encodeURIComponent(parma.replace(" ", "+").replace("/", ""));
      dbCache.push(db_search_loc, all_searchs);
    })
    .catch(function (error) {
      console.log(error);
      if (cse_token != "AJvRUv2OYDhxzl9Z-2XAB5HhZtiN:1650263205186")
        requestSearch(
          cx,
          "AJvRUv2OYDhxzl9Z-2XAB5HhZtiN:1650263205186",
          api,
          parma,
          errorlog,
          result,
          print,
          dbCache
        );
    });
}

module.exports = function (parma, dbMain, print, errorlog, dbCache, result) {
  stats_one(print, errorlog, dbMain, "api/crawler/gameSearch/search");
  const db_search_loc =
    "/crawler/data/game/search/array/" +
    encodeURIComponent(parma.replace(" ", "+").replace("/", ""));

  try {
    var rss_cache = dbCache.getData(db_search_loc);
    if (rss_cache.length > 0) {
      print("Crawler: Game Search Read from database");
      result(rss_cache);
      return;
    }
  } catch (e) {
    print("Crawler: No data from cache database - " + db_search_loc);
  }

  var a1 = Math.floor(Math.random() * 10).toString();
  var a2 = Math.floor(Math.random() * 10).toString();
  var a3 = Math.floor(Math.random() * 10).toString();
  var a4 = Math.floor(Math.random() * 10).toString();
  var api = a1 + a2 + a3 + a4;

  const cx = "59575e226d2cdcdf7";

  axios.get("https://cse.google.com/cse.js?cx=" + cx).then(function (res) {
    let data = /cse_token":.*?"(.*?)"/im.exec(res.data)[0];
    let cse_token = data.substring(13).replace('"', "");
    requestSearch(cx, cse_token, api, parma, errorlog, result, print, dbCache);
  });
};
