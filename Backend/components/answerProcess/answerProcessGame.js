// Process answer after NLP
// Return with answer or send by "conn"

const https = require('https');

module.exports = function ({obj,answer,conn}) { 
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
        conn.sendText(JSON.stringify(urlsend));

        var options = {
          hostname: 'niagara.krunk.cn',
          port: 443,
          path: '/today-api.php',
          method: 'GET'
        }

        var req = https.request(options, res => {
          if (res.statusCode!=200){
            console.error("Niagara COVID Fetch Api Error: "+res.statusCode)
            return;
          }
          res.on('data', d => {
            const data = JSON.parse(d);
            const result = "As of "+data['date']+" in Niagara Region, Total Cases: "+data['strCaseNumbers']+
              ", Total Resolved Cases: "+data['spnResolvedCases']+", Total Death Cases: "+data['death'];

            var send = {
              'type': 'text',
              'text': result,
              'disableInput': false
            }
            conn.sendText(JSON.stringify(send));
          })
        })

        req.on('error', error => {
          console.error("Niagara COVID Fetch Api Error: "+error)
        })

        req.end()
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
              'value': 'https://www.google.com/maps/dir/?api=1&destination='+location+'&travelmode=drive',
              'action': 'url'
            },
            {
              'text': 'Bus',
              'value': 'https://www.google.com/maps/dir/?api=1&destination='+location+'&travelmode=transit',
              'action': 'url'
            },
            {
              'text': 'Walk',
              'value': 'https://www.google.com/maps/dir/?api=1&destination='+location+'&travelmode=walking',
              'action': 'url'
            }
          ]
        }
        conn.sendText(JSON.stringify(urlsend));
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