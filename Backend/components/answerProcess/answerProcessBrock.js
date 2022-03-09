// Process answer after NLP
// Return with answer or send by "conn"

const fs = require('fs');
const csv = require('csv-parser');
const covidNiagara = require('../crawler/covidNiagara');

function sendCourseDetails(conn, result_array, number){
  if (result_array[number]!=""&&result_array[number].toLowerCase()!="none"&&result_array[number].toLowerCase()!="null"){
    var send = {
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
  fs.createReadStream('data/train-data/brock/course/data.csv')
  .pipe(csv())
  .on('data', (row) => {
    var course = row[Object.keys(row)].split("\t");
    if (param.toUpperCase() == course[0].toUpperCase()){
      result_array = course;
    }
  })
  .on('end', () => {
    if (result_array==null){
      var send = {
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

module.exports = function ({obj, answer, conn, dbCache, print, errorlog}) { 
  var urlsend = "";

    if (answer.charAt(0)=='!'){
    var temp = (' ' + answer).slice(1);
    const control = temp.substr(0,temp.indexOf('-'));

    temp = (' ' + answer).slice(1);
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

        covidNiagara(dbCache, print,errorlog,function (data) {
          var send = {
            'type': 'text',
            'text': data,
            'disableInput': false
          }
          conn.sendText(JSON.stringify(send));
        });

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
      
      case "!courseDeliver": // Course Location
        readCourseFromCsv(conn,param,5);
        return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
      
      case "!courseProf": // Course Prof
        //readCourseFromCsv(conn,param,10);
        return "TODO";
        //return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
      
      case "!coursePrerequisites": // Course Prerequisites
        readCourseFromCsv(conn,param,6);
        return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
      
      case "!courseLab": // Course Lab
        readCourseFromCsv(conn,param,2);
        return "!ignore";
        
// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!programDes": // 
        if (param == "{{brockProgram}}"){
          return "This program does not appear to exist, sorry.";
        }
        return param + " program details will be here";
        
// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!programReq": // Course Location
        if (param == "{{brockProgram}}"){
          return "This program does not appear to exist, sorry.";
        }
        return param + " program requirements will be here";


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