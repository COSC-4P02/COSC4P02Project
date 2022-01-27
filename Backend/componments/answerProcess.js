// Process answer after NLP
// Return with answer or send by "conn"

const https = require('https');

module.exports = function ({answer,conn}) { 
    if (answer.charAt(0)=='!'){
    var temp = (' ' + answer).slice(1);
    const control = temp.substr(0,temp.indexOf('-'));

    var temp = (' ' + answer).slice(1);
    const param = temp.substr(temp.indexOf('-')+1,temp.length-1);

    switch(control) {
      case "!covidNiagara": // COVID Infomation

        // COVID Links
        urlsend = {
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

        const options = {
          hostname: 'niagara.krunk.cn',
          port: 443,
          path: '/today-api.php',
          method: 'GET'
        }

        const req = https.request(options, res => {
          //console.log(`状态码: ${res.statusCode}`)
          if (res.statusCode!=200){
            console.error("Niagara COVID Fetch Api Error: "+res.statusCode)
            return;
          }
          res.on('data', d => {
            const data = JSON.parse(d);
            const result = "As of "+data['date']+" in Niagara Region, Total Cases: "+data['strCaseNumbers']+
              ", Total Resolved Cases: "+data['spnResolvedCases']+", Total Death Cases: "+data['death'];

            send = {
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


      case "!courseDes": // Course Description
        return "Course Description is here "+param;


      case "!courseTime": // Course Time
        return "Course Time is here "+param;


      case "!courseLocation": // Course Location
        return "Course Location is here "+param;

        
      default:
        errorlog("Error from answerProcess: "+answer);
        return "Oops, Something went wrong, try again later";
    }
  }else{
    return answer;
  }
};