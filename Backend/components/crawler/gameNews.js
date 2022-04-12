const axios = require("axios").default;
const jsdom = require("jsdom-no-css");
const { JSDOM } = jsdom;
var { stats_one } = require("../statsService");

// Canada Game 2022 News

module.exports = function (noFetch, dbMain, dbCache, print, errorlog, result) {
  var sent = false;

  stats_one(print, errorlog, dbMain, "api/crawler/gameNews/recent");
  const db_news_loc = "/crawler/data/game/news/recent";
  const db_loc_date = "/crawler/data/game/news/date";
  const cache_max_time = 0.1; // Max cache time (Hour)
  try {
    var rss_cache = dbCache.getData(db_news_loc);
    if (rss_cache.length > 0 || rss_cache.title != "failed") {
      print("Crawler: Game News Read from database");
      result(rss_cache);
      sent = true;
    }
  } catch (e) {
    print("Crawler: No data from cache database - " + db_news_loc);
  }

  if (sent && noFetch) return;

  if (sent) {
    try {
      var data_cache_date = dbCache.getData(db_loc_date);
      const expire_timer = new Date(data_cache_date) - new Date();
      const expire_timer_format =
        "PassTime: " + ((expire_timer / 1000 / 60) * -1).toFixed(2) + " Min";
      if (expire_timer >= -1000 * 60 * 60 * cache_max_time) {
        print("Crawler: Game News Skip Fetch | " + expire_timer_format);
        return;
      }
    } catch (e) {
      print("Crawler: No data from cache database - " + db_loc_date);
    }
  }

  axios
    .get("https://www.canadagames.ca/in-the-loop")
    .then(function (res) {
      var all_news = {
        title: "Canada Game News",
        description: "",
        link: "https://www.canadagames.ca/",
        image: "",
        category: [],
        items: [],
      };
      const dom = new JSDOM(res.data);
      const total_array = dom.window.document.querySelectorAll(
        ".articles-feed .w-dyn-item"
      );
      for (const item of total_array) {
        var image = item.querySelector(
          ".article-wrap .basic-box .basic-wrap .basic-img img"
        ).src;
        if (image === "" || image === "https://global-uploads.webflow.com/") {
          image =
            "https://global-uploads.webflow.com/5d655866b2055c7cbb5d79a1/613a52ef7397e002b05fbdd9_37548692796_ec27fc520d_k.jpg";
        }
        const data = {
          title: item.querySelector(
            ".article-wrap .basic-box .basic-wrap .basic-content .intro-card .title-limit"
          ).textContent,
          description: item.querySelector(
            ".article-wrap .basic-box .basic-wrap .basic-content .intro-card .para-block .para-card"
          ).textContent,
          link:
            "https://www.canadagames.ca" +
            item.querySelector(
              ".article-wrap .basic-box .basic-wrap .basic-content .mob-card-link"
            ).href,
          image: image,
        };
        all_news["items"].push(data);
      }
      if (!sent) result(all_news);
      dbCache.push(db_news_loc, all_news);
      dbCache.push(db_loc_date, new Date());
    })
    .catch(function (error) {
      console.log(error);
    });
};
