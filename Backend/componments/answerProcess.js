// Process answer after NLP
// Return with answer or send by "conn"

const https = require('https');
const fs = require('fs');
const csv = require('csv-parser');

function sendCourseDetails(conn,result_array,number){
  if (result_array[number]!=""&&result_array[number].toLowerCase()!="none"&&result_array[number].toLowerCase()!="null"){
    send = {
      'type': 'text',
      'text': result_array[number],
      'disableInput': false
    }
    conn.sendText(JSON.stringify(send));
  }
}

// Read courses from csv
function readCourseFromCsv(conn,param,number){
  var result_array = null;
  fs.createReadStream('train-data/brock/course/data.csv')
  .pipe(csv())
  .on('data', (row) => {
    var course = row[Object.keys(row)].split("\t");
    if (param.toUpperCase() == course[0].toUpperCase()){
      result_array = course;
    }
  })
  .on('end', () => {
    if (result_array==null){
      send = {
        'type': 'text',
        'text': "Can not find info about it",
        'disableInput': false
      }
      conn.sendText(JSON.stringify(send));
      console.error("Can not find info - "+param);
    }else{
      if (number==1)
        sendCourseDetails(conn,result_array,4) // Title
      sendCourseDetails(conn,result_array,number) // Des
      if (number==1){
        sendCourseDetails(conn,result_array,5) // Type
        sendCourseDetails(conn,result_array,6) // Restriction
        sendCourseDetails(conn,result_array,7) // Note
      }
    }
  });
}

module.exports = function ({answer,conn}) { 
    if (answer.charAt(0)=='!'){
    var temp = (' ' + answer).slice(1);
    const control = temp.substr(0,temp.indexOf('-'));

    var temp = (' ' + answer).slice(1);
    const param = temp.substr(temp.indexOf('-')+1,temp.length-1);

    switch(control) {

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!covidNiagara": // COVID Infomation

        // COVID Links
        urlsend = {
          'type': 'button',
          'text': "Here are some links about COVID-19",
          'disableInput': false,
          'options': [
            {
              'text': 'Brock University COVID',
              'value': 'https://brocku.ca/coronavirus/',
              'action': 'url'
            },
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

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!courseDes": // Course Description
        readCourseFromCsv(conn,param,1);
        return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!courseTime": // Course Time
        readCourseFromCsv(conn,param,3);
        return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!courseLocation": // Course Location
        readCourseFromCsv(conn,param,2);
        return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!brockAbout": // Brock About
        urlsend = {
          'type': 'button',
          'text': "Brock University is one of Canada’s top post-secondary institutions. Located in historic Niagara region, Brock offers all the benefits of a young and modern university in a safe, community-minded city with beautiful natural surroundings.",
          'disableInput': false,
          'options': [
            {
              'text': 'About',
              'value': 'https://brocku.ca/about/',
              'action': 'url'
            },
            {
              'text': 'Homepage',
              'value': 'https://brocku.ca/',
              'action': 'url'
            },
            {
              'text': 'News',
              'value': 'https://brocku.ca/brock-news/',
              'action': 'url'
            },
            {
              'text': 'Maps',
              'value': 'https://goo.gl/maps/LhZQxd2xQ86LZUAP7',
              'action': 'url'
            }
          ]
        }
        conn.sendText(JSON.stringify(urlsend));
        return "!ignore";

    // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!start": // Course Location
        urlsend = {
          'type': 'button',
          'text': "Welcome! Here are some question you may ask!",
          'disableInput': false,
          'options': [
            {
              'text': 'Tell me about Brock',
              'action': 'postback'
            },
            {
              'text': 'Where is Brock',
              'action': 'postback'
            },
            {
              'text': 'What is COSC 4P01',
              'action': 'postback'
            },
            {
              'text': 'COVID in Niagara',
              'action': 'postback'
            }
          ]
        }
        conn.sendText(JSON.stringify(urlsend));
        return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      default:
        console.error("Error from answerProcess: "+answer);
        return "Oops, Something went wrong, try again later";
    }
  }else{
    return answer;
  }
};