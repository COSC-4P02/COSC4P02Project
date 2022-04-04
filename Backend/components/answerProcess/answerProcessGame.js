// Process answer after NLP
// Return with answer or send by "conn"

const covidNiagara = require('../crawler/covidNiagara');

module.exports = function (obj,answer,conn,dbMain,dbCache,print,errorlog) { 
    if (answer.charAt(0)=='!'){
    var temp = (' ' + answer).slice(1);
    const control = temp.substr(0,temp.indexOf('-'));

    temp = (' ' + answer).slice(1);
    const param = temp.substr(temp.indexOf('-')+1,temp.length-1); // eslint-disable-line

    switch(control) {

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!covidNiagara": // COVID Infomation

        // COVID Links
        var urlsend = {
          'type': 'button',
          'text': "Here are some links about COVID-19",
          'disableInput': false,
          'options': [
            {
              'text': 'Niagara Region COVID',
              'value': 'https://niagararegion.ca/health/covid-19/statistics.aspx',
              'action': 'url'
            },
            {
              'text': 'Canada COVID',
              'value': 'https://health-infobase.canada.ca/covid-19/epidemiological-summary-covid-19-cases.html#newCases',
              'action': 'url'
            },
            {
              'text': 'Ontario COVID',
              'value': 'https://covid-19.ontario.ca/data/case-numbers-and-spread',
              'action': 'url'
            }
          ]
        }
        conn(JSON.stringify(urlsend));

        covidNiagara(dbCache, print,errorlog,function (data) {
          var send = {
            'type': 'text',
            'text': data,
            'disableInput': false
          }
          conn(JSON.stringify(send));
        });
        
        return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!navgation": // Navagation - Google Maps

        var location = param;
        if (param == "{{navLocation}}"){
          location = obj.msg;
        }

        urlsend = {
          'type': 'button',
          'text': "You can see route here",
          'disableInput': false,
          'options': [
            {
              'text': 'Drive',
              'value': encodeURI('https://www.google.com/maps/dir/?api=1&destination='+location+'&travelmode=drive'),
              'action': 'url'
            },
            {
              'text': 'Bus',
              'value': encodeURI('https://www.google.com/maps/dir/?api=1&destination='+location+'&travelmode=transit'),
              'action': 'url'
            },
            {
              'text': 'Walk',
              'value': encodeURI('https://www.google.com/maps/dir/?api=1&destination='+location+'&travelmode=walking'),
              'action': 'url'
            }
          ]
        }
        conn(JSON.stringify(urlsend));
        return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!gameCountdown": // 

        var second = 1000;
        var minute = second * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var countDown = new Date('Aug 06, 2022 00:00:00').getTime();

        var now = new Date().getTime(),
        distance = countDown - now;

        var c_day = Math.floor(distance / (day))
        var c_hours = Math.floor((distance % (day)) / (hour))
        var c_minutes = Math.floor((distance % (hour)) / (minute))
        var c_seconds = Math.floor((distance % (minute)) / second)

        var text = ""

        if (c_day>=0){
          text = ("The Niagara 2022 Games website says the event starts on Aug 06, 2022, which is " + c_day+" days "+c_hours+" hrs "+c_minutes+" min "+c_seconds+" sec left.");
        }else{
          c_day = 0 - c_day;
          text = ("The Niagara 2022 Games website says the event starts on Aug 06, 2022, so the games is already start for " + c_day+" days.");
        }

        urlsend = {
          'type': 'button',
          'text': text,
          'disableInput': false,
          'options': [
            {
              'text': 'Learn more about Tickets',
              'action': 'postback'
            },
            {
              'text': 'Niagara Games Website',
              'value': "https://niagara2022games.ca/",
              'action': 'url'
            }
          ]
        }
        conn(JSON.stringify(urlsend));
        return "!ignore";


// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!news": // 

        var gameNews = require('../crawler/gameNews');
        gameNews(0, dbMain, dbCache, print, errorlog, function (rss) {

          for (var i = rss['items'].length - 1; i >= 0; i--) {
            rss['items'][i]['href'] = rss['items'][i]['link']
          }

          urlsend = {
            'type': 'news',
            'text': "Here are the recent news about Canada Games",
            'news': rss['items'],
            'disableInput': false,
            'options': [
              {
                'text': 'Canada Games News',
                'value': "https://canadagames.ca/in-the-loop",
                'action': 'url'
              },
              {
                'text': 'Niagara Games Website',
                'value': "https://niagara2022games.ca/",
                'action': 'url'
              }
            ]
          }
          conn(JSON.stringify(urlsend));
        });

        
        return "!ignore";
        
// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!json":
        return "!json"

      default:
        console.error("Error from answerProcess: "+answer);
        return "Oops, Something went wrong, try again later";
    }
  }else{
    return answer;
  }
};