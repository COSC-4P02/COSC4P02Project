// Process answer after NLP
// Return with answer or send by "conn"

const covidNiagara = require("../crawler/covidNiagara");
const fs = require("fs");
const Fuse = require("fuse.js");

module.exports = function (
  obj,
  answer,
  conn,
  dbMain,
  dbCache,
  print,
  errorlog
) {
  if (answer.charAt(0) == "!") {
    var temp = (" " + answer).slice(1);
    const control = temp.substr(0, temp.indexOf("-"));

    temp = (" " + answer).slice(1);
    const param = temp.substr(temp.indexOf("-") + 1, temp.length - 1); // eslint-disable-line

    var second = 1000;
    var minute = second * 60;
    var hour = minute * 60;
    var day = hour * 24;

    switch (control) {
      // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!covidNiagara": // COVID Infomation
        // COVID Links
        var urlsend = {
          type: "button",
          text: "Here are some links about COVID-19",
          disableInput: false,
          options: [
            {
              text: "Niagara Region COVID",
              value: "https://niagararegion.ca/health/covid-19/statistics.aspx",
              action: "url",
            },
            {
              text: "Canada COVID",
              value:
                "https://health-infobase.canada.ca/covid-19/epidemiological-summary-covid-19-cases.html#newCases",
              action: "url",
            },
            {
              text: "Ontario COVID",
              value: "https://covid-19.ontario.ca/data/case-numbers-and-spread",
              action: "url",
            },
          ],
        };
        conn(JSON.stringify(urlsend));

        covidNiagara(dbCache, print, errorlog, function (data) {
          var send = {
            type: "text",
            text: data,
            disableInput: false,
          };
          conn(JSON.stringify(send));
        });

        return "!ignore";

      // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!navgation": // Navagation - Google Maps
        var location = param;
        if (param == "{{navLocation}}") {
          location = obj.msg;
        }

        urlsend = {
          type: "button",
          text: "You can see route here",
          disableInput: false,
          options: [
            {
              text: "Drive",
              value: encodeURI(
                "https://www.google.com/maps/dir/?api=1&destination=" +
                  location +
                  "&travelmode=drive"
              ),
              action: "url",
            },
            {
              text: "Bus",
              value: encodeURI(
                "https://www.google.com/maps/dir/?api=1&destination=" +
                  location +
                  "&travelmode=transit"
              ),
              action: "url",
            },
            {
              text: "Walk",
              value: encodeURI(
                "https://www.google.com/maps/dir/?api=1&destination=" +
                  location +
                  "&travelmode=walking"
              ),
              action: "url",
            },
          ],
        };
        conn(JSON.stringify(urlsend));
        return "!ignore";

      // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!gameCountdown": //
        var countDown = new Date("Aug 06, 2022 00:00:00").getTime();

        var now = new Date().getTime(),
          distance = countDown - now;

        var c_day = Math.floor(distance / day);
        var c_hours = Math.floor((distance % day) / hour);
        var c_minutes = Math.floor((distance % hour) / minute);
        var c_seconds = Math.floor((distance % minute) / second);

        var text = "";

        if (c_day >= 0) {
          text =
            "The Niagara 2022 Games website says the event starts on Aug 06, 2022, which is " +
            c_day +
            " days " +
            c_hours +
            " hrs " +
            c_minutes +
            " min " +
            c_seconds +
            " sec left.";
        } else {
          c_day = 0 - c_day;
          text =
            "The Niagara 2022 Games website says the event starts on Aug 06, 2022, so the games is already start for " +
            c_day +
            " days.";
        }

        urlsend = {
          type: "button",
          text: text,
          disableInput: false,
          options: [
            {
              text: "Learn more about Tickets",
              action: "postback",
            },
            {
              text: "Niagara Games Website",
              value: "https://niagara2022games.ca/",
              action: "url",
            },
          ],
        };
        conn(JSON.stringify(urlsend));
        return "!ignore";

      // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!news": //
        var gameNews = require("../crawler/gameNews");
        gameNews(0, dbMain, dbCache, print, errorlog, function (rss) {
          for (var i = rss["items"].length - 1; i >= 0; i--) {
            rss["items"][i]["href"] = rss["items"][i]["link"];
          }

          urlsend = {
            type: "news",
            text: "Here are the recent news about Canada Games",
            news: rss["items"],
            disableInput: false,
            options: [
              {
                text: "Canada Games News",
                value: "https://canadagames.ca/in-the-loop",
                action: "url",
              },
              {
                text: "Niagara Games Website",
                value: "https://niagara2022games.ca/",
                action: "url",
              },
            ],
          };
          conn(JSON.stringify(urlsend));
        });

        return "!ignore";

      // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!athletesInfo": //
        var query_name = param;
        var i;
        var database_url =
          "https://cg2015.gems.pro/Result/ShowPerson_List.aspx?SetLanguage=en-CA";

        var csvFilePath = "train-data/game/2015version.csv";
        var csv = require("csvtojson");
        csv()
          .fromFile(csvFilePath)
          .then((jsonArray) => {
            const fuse = new Fuse(jsonArray, {
              keys: ["name"],
            });
            var result = fuse.search(query_name)[0]["item"];

            if (!result) {
              urlsend = {
                type: "button",
                text: "This player does not exist in 2015 Canada Games Database, you may find him/her in the following links",
                disableInput: false,
                options: [
                  {
                    text: "2015 Canada Games Database",
                    value: database_url,
                    action: "url",
                  },
                  {
                    text: "2019 Canada Games Database",
                    value:
                      "https://cgc.gems.pro/AlumCgc/Alumni/FindAlumni_List.aspx",
                    action: "url",
                  },
                  {
                    text: "2022 Canada Games Database",
                    value: "https://cg2022.gems.pro/default.aspx",
                    action: "url",
                  },
                ],
              };
              conn(JSON.stringify(urlsend));
              return "!ignore";
            }

            urlsend = {
              type: "text",
              text:
                "Found: " +
                result.name +
                ", Data is based on 2015 Canada Games Database",
              disableInput: false,
            };
            conn(JSON.stringify(urlsend));

            var birthday = 2015 - parseInt(result["age"].replace('"', ""));
            var hometown = result["hometown"];
            var sport = result["sport"];
            var all_game_played = [];

            var url = result["url"];
            if (url == "") {
              url = database_url;
            }

            for (i = 4; i > 0; i--) {
              var tag = "PrevousGame" + i;
              if (
                result[tag].toLowerCase() != "" &&
                result[tag].toLowerCase() != "n/a" &&
                result[tag].toLowerCase() != "none" &&
                result[tag].toLowerCase() != "none." &&
                result[tag].toLowerCase() != "/" &&
                result[tag].toLowerCase() != "0"
              ) {
                all_game_played.push(result["PrevousGame" + i]);
              }
            }

            if (all_game_played.length > 0) {
              answer =
                result.name +
                " was born in " +
                hometown +
                " in " +
                birthday +
                " and play " +
                sport +
                " in ";
              for (i = all_game_played.length - 1; i >= 0; i--) {
                answer += all_game_played[i];
                if (i > 0) {
                  answer += ", ";
                }
              }
              answer += ".";
            } else {
              answer =
                result.name +
                " was born in " +
                hometown +
                " in " +
                birthday +
                " and play " +
                sport +
                " in games.";
            }

            urlsend = {
              type: "button",
              text: answer,
              disableInput: false,
              options: [
                {
                  text: "More Athletes Info",
                  value: url,
                  action: "url",
                },
                {
                  text: "2015 Canada Games Database",
                  value: database_url,
                  action: "url",
                },
                {
                  text: "2019 Canada Games Database",
                  value:
                    "https://cgc.gems.pro/AlumCgc/Alumni/FindAlumni_List.aspx",
                  action: "url",
                },
                {
                  text: "2022 Canada Games Database",
                  value: "https://cg2022.gems.pro/default.aspx",
                  action: "url",
                },
              ],
            };
            conn(JSON.stringify(urlsend));
          });
        return "!ignore";

      // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!sportsSchedule": //
        var cg_schedule = fs.readFileSync("train-data/game/cg_schedule.json");
        var cg_schedule_array = JSON.parse(cg_schedule);
        var fuse = new Fuse(cg_schedule_array, {
          keys: ["title"],
        });
        var search = fuse.search(param);
        if (search.length <= 0) {
          urlsend = {
            type: "button",
            text: "This sport does not exist in 2022 Canada Games, you may find all sports schedules in the following links",
            disableInput: false,
            options: [
              {
                text: "cg2022 Schedules",
                value:
                  "https://cg2022.gems.pro/Result/Sport_List.aspx?SetLanguage=en-CA",
                action: "url",
              },
            ],
          };
          conn(JSON.stringify(urlsend));
          return "!ignore";
        }
        var s = search[0]["item"];
        var sport = s["time"];
        var name = s["title"];
        for (i = 0; i < sport.length; i++) {
          var now1 = new Date().getTime();
          var time = new Date(sport[i][0]).getTime();
          var distance1 = time - now1;
          var remain_days = Math.floor(distance1 / day);
          if (remain_days >= 0) {
            urlsend = {
              type: "button",
              text: "The next " + name + " game will be on " + sport[i][0],
              disableInput: false,
              options: [
                {
                  text: name + " Schedule",
                  value: sport[i][1],
                  action: "url",
                },
                {
                  text: "All Schedules",
                  value:
                    "https://cg2022.gems.pro/Result/Sport_List.aspx?SetLanguage=en-CA",
                  action: "url",
                },
              ],
            };
            conn(JSON.stringify(urlsend));
            break;
          }
        }
        return "!ignore";

      // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!json":
        return "!json";

      default:
        console.error("Error from answerProcess: " + answer);
        return "Oops, Something went wrong, try again later";
    }
  } else {
    return answer;
  }
};
