// Process answer after NLP
// Return with answer or send by "conn"

const fs = require('fs');
const covidNiagara = require('../crawler/covidNiagara');

function sendCourseDetails(conn, result_array, number){
  if (result_array[number]!=""&&result_array[number].toLowerCase()!="none"&&result_array[number].toLowerCase()!="null"){
    var send = {
      'type': 'text',
      'text': result_array[number],
      'disableInput': false
    }
    conn.sendText(JSON.stringify(send));
  }else{
    var send = {
      'type': 'text',
      'text': "There are no information about "+number+", Sorry about that.",
      'disableInput': false
    }
    conn.sendText(JSON.stringify(send));
  }
}

// Read courses from csv
function readCourseFromBrockData(conn,param,number,dbCache,print,errorlog, callback){
  var result_array = null;

  if (param=="{{brockCourse}}"){
    callback(result_array);
  }

  const brockData = require('../crawler/brockData');
  brockData(dbCache, print,errorlog,function (data) {
    for (var i = data['course'].length - 1; i >= 0; i--) {
      var course1 = data['course'][i]['course'].toUpperCase();
      const courseName1 = course1.toUpperCase();
      const courseName2 = course1.toLowerCase();
      const courseName3 = course1.toUpperCase().replace('-', ' ');
      const courseName4 = course1.toUpperCase().replace('P', '').replace('F', '');
      const courseName5 = course1.toUpperCase().replace('-', ' ').replace('P', '').replace('F', '');
      const courseName6 = course1.toUpperCase().replace('-', '').replace('P', '').replace('F', '');
      if (param.toUpperCase() == courseName1||
        param.toUpperCase() == courseName2||
        param.toUpperCase() == courseName3||
        param.toUpperCase() == courseName4||
        param.toUpperCase() == courseName5||
        param.toUpperCase() == courseName6){
        result_array = data['course'][i];
        break;
      }
    }
    callback(result_array);
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
        readCourseFromBrockData(conn,param,1,dbCache,print,errorlog,function (result_array) {
          if (result_array==null){
            var send = {
              'type': 'text',
              'text': "Can not find info about it",
              'disableInput': false
            }
            conn.sendText(JSON.stringify(send));
            console.error("Can not find info - "+param);
          }else{
            sendCourseDetails(conn,result_array,"title") // Title
            sendCourseDetails(conn,result_array,"description") // Des
            sendCourseDetails(conn,result_array,"format") // Type
            sendCourseDetails(conn,result_array,"restriction") // Restriction
            sendCourseDetails(conn,result_array,"note") // Note
          }
        });
        return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!courseTime": // Course Time
        var result_array = readCourseFromBrockData(conn,param,3,dbCache,print,errorlog,function (result_array) {
          if (result_array==null){
            var send = {
              'type': 'text',
              'text': "Can not find info about it",
              'disableInput': false
            }
            conn.sendText(JSON.stringify(send));
            console.error("Can not find info - "+param);
          }else{
            sendCourseDetails(conn,result_array,"time")
          }
        });
        return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!courseLocation": // Course Location
        var result_array = readCourseFromBrockData(conn,param,2,dbCache,print,errorlog,function (result_array) {
          if (result_array==null){
            var send = {
              'type': 'text',
              'text': "Can not find info about it",
              'disableInput': false
            }
            conn.sendText(JSON.stringify(send));
            console.error("Can not find info - "+param);
          }else{
            sendCourseDetails(conn,result_array,"location")
          }
        });
        return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
      
      case "!courseDeliver": // Course Deliver
        var result_array = readCourseFromBrockData(conn,param,5,dbCache,print,errorlog,function (result_array) {
          if (result_array==null){
            var send = {
              'type': 'text',
              'text': "Can not find info about it",
              'disableInput': false
            }
            conn.sendText(JSON.stringify(send));
            console.error("Can not find info - "+param);
          }else{
            sendCourseDetails(conn,result_array,"format")
          }
        });
        return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
      
      case "!courseProf": // Course Prof
        var result_array = readCourseFromBrockData(conn,param,10,dbCache,print,errorlog,function (result_array) {
          if (result_array==null){
            var send = {
              'type': 'text',
              'text': "Can not find info about it",
              'disableInput': false
            }
            conn.sendText(JSON.stringify(send));
            console.error("Can not find info - "+param);
          }else{
            sendCourseDetails(conn,result_array,"professor")
          }
        });
        return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
      
      case "!coursePrerequisites": // Course Prerequisites
        var result_array = readCourseFromBrockData(conn,param,6,dbCache,print,errorlog,function (result_array) {
          if (result_array==null){
            var send = {
              'type': 'text',
              'text': "Can not find info about it",
              'disableInput': false
            }
            conn.sendText(JSON.stringify(send));
            console.error("Can not find info - "+param);
          }else{
            sendCourseDetails(conn,result_array,"prerequisites")
          }
        });
        return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
      
      case "!courseLab": // Course Lab
        var result_array = readCourseFromBrockData(conn,param,2,dbCache,print,errorlog,function (result_array) {
          if (result_array==null){
            var send = {
              'type': 'text',
              'text': "Can not find info about it",
              'disableInput': false
            }
            conn.sendText(JSON.stringify(send));
            console.error("Can not find info - "+param);
          }else{
            sendCourseDetails(conn,result_array,"lab")
          }
        });
        return "!ignore";
        
// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!courseExam": // Course
        var result_array = readCourseFromBrockData(conn,param,2,dbCache,print,errorlog,function (result_array) {
          if (result_array==null){
            var send = {
              'type': 'text',
              'text': "Can not find info about it",
              'disableInput': false
            }
            conn.sendText(JSON.stringify(send));
            console.error("Can not find info - "+param);
          }else{
            sendCourseDetails(conn,result_array,"exam location")
            sendCourseDetails(conn,result_array,"exam time")
          }
        });
        return "!ignore";
        
// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!courseExamTime": // Course
        var result_array = readCourseFromBrockData(conn,param,2,dbCache,print,errorlog,function (result_array) {
          if (result_array==null){
            var send = {
              'type': 'text',
              'text': "Can not find info about it",
              'disableInput': false
            }
            conn.sendText(JSON.stringify(send));
            console.error("Can not find info - "+param);
          }else{
            sendCourseDetails(conn,result_array,"exam time")
          }
        });
        return "!ignore";
        
// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!courseExamLoc": // Course
        var result_array = readCourseFromBrockData(conn,param,2,dbCache,print,errorlog,function (result_array) {
          if (result_array==null){
            var send = {
              'type': 'text',
              'text': "Can not find info about it",
              'disableInput': false
            }
            conn.sendText(JSON.stringify(send));
            console.error("Can not find info - "+param);
          }else{
            sendCourseDetails(conn,result_array,"exam location")
          }
        });
        return "!ignore";
        
// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!courseTerm": // Course
        var result_array = readCourseFromBrockData(conn,param,2,dbCache,print,errorlog,function (result_array) {
          if (result_array==null){
            var send = {
              'type': 'text',
              'text': "Can not find info about it",
              'disableInput': false
            }
            conn.sendText(JSON.stringify(send));
            console.error("Can not find info - "+param);
          }else{
            sendCourseDetails(conn,result_array,"term")
          }
        });
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