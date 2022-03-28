// Process answer after NLP
// Return with answer or send by "conn"

const covidNiagara = require('../crawler/covidNiagara');

function sendCourseDetails(conn, result_array, number, ignoreifnone){
  var send = {}
  try {
    if (result_array[number]!=""&&result_array[number].toLowerCase()!="none"&&result_array[number].toLowerCase()!="null"){
      send = {
        'type': 'text',
        'text': result_array[number],
        'disableInput': false
      }
      conn(JSON.stringify(send));
      return
    }else{
      if (ignoreifnone)
        return
    }
  } catch (error) {
    console.log(number);
    console.error(error);
  }
  if (ignoreifnone)
    return
  send = {
    'type': 'text',
    'text': "There are no information about "+number+"",
    'disableInput': false
  }
  conn(JSON.stringify(send));
}

// Read courses from csv
function readCourseFromBrockData(conn,param,number,dbCache,print,errorlog, callback){
  var result_array = null;

  if (param=="{{brockCourse}}"){
    callback(result_array);
  }

  const brockData = require('../crawler/brockData');
  brockData(dbCache, print,errorlog,function (data) {
    var inputCourse = param.toUpperCase().replace(' ','').replace('-','').replace(' ','').replace('/','')
    for (var key in data) {
      var course1 = key.toUpperCase();
      const courseName1 = course1.toUpperCase();
      const courseName2 = course1.toLowerCase();
      const courseName3 = course1.toUpperCase().replace('-', '');
      const courseName4 = course1.toUpperCase().replace('P', '').replace('F', '');
      const courseName5 = course1.toUpperCase().replace('-', '').replace('P', '').replace('F', '');
      const courseName6 = course1.toUpperCase().replace('-', '').replace('P', '').replace('F', '');
      if (inputCourse == courseName1||
        inputCourse == courseName2||
        inputCourse == courseName3||
        inputCourse == courseName4||
        inputCourse == courseName5||
        inputCourse == courseName6){
        result_array = data[key];
        break;
      }
    }
    callback(result_array);
  });
}

module.exports = function (obj, answer, conn, dbCache, print, errorlog) {
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

      case "!courseDes": // Course Description
        readCourseFromBrockData(conn,param,1,dbCache,print,errorlog,function (result_array) {
          if (result_array==null){
            var send = {
              'type': 'text',
              'text': "Can not find info about it",
              'disableInput': false
            }
            conn(JSON.stringify(send));
            console.error("Can not find info - "+param);
          }else{
            sendCourseDetails(conn,result_array,"title",0) // Title
            sendCourseDetails(conn,result_array,"description",0) // Des
            sendCourseDetails(conn,result_array,"format",1) // Type
            sendCourseDetails(conn,result_array,"restrictions",1) // Restriction
            sendCourseDetails(conn,result_array,"exclusions",1)
            sendCourseDetails(conn,result_array,"crosslisting",1)
            sendCourseDetails(conn,result_array,"notes",1) // Note
          }
        });
        return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!courseTime": // Course Time
        readCourseFromBrockData(conn,param,3,dbCache,print,errorlog,function (result_array) {
          if (result_array==null){
            var send = {
              'type': 'text',
              'text': "Can not find info about it",
              'disableInput': false
            }
            conn(JSON.stringify(send));
            console.error("Can not find info - "+param);
          }else{
            sendCourseDetails(conn,result_array,"time")
          }
        });
        return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!courseLocation": // Course Location
        readCourseFromBrockData(conn,param,2,dbCache,print,errorlog,function (result_array) {
          if (result_array==null){
            var send = {
              'type': 'text',
              'text': "Can not find info about it",
              'disableInput': false
            }
            conn(JSON.stringify(send));
            console.error("Can not find info - "+param);
          }else{
            sendCourseDetails(conn,result_array,"location")
          }
        });
        return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
      
      case "!courseDeliver": // Course Deliver
        readCourseFromBrockData(conn,param,5,dbCache,print,errorlog,function (result_array) {
          if (result_array==null){
            var send = {
              'type': 'text',
              'text': "Can not find info about it",
              'disableInput': false
            }
            conn(JSON.stringify(send));
            console.error("Can not find info - "+param);
          }else{
            sendCourseDetails(conn,result_array,"format")
          }
        });
        return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
      
      case "!courseProf": // Course Prof
        readCourseFromBrockData(conn,param,10,dbCache,print,errorlog,function (result_array) {
          if (result_array==null){
            var send = {
              'type': 'text',
              'text': "Can not find info about it",
              'disableInput': false
            }
            conn(JSON.stringify(send));
            console.error("Can not find info - "+param);
          }else{
            sendCourseDetails(conn,result_array,"professor")
          }
        });
        return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
      
      case "!coursePrerequisites": // Course Prerequisites
        readCourseFromBrockData(conn,param,6,dbCache,print,errorlog,function (result_array) {
          if (result_array==null){
            var send = {
              'type': 'text',
              'text': "Can not find info about it",
              'disableInput': false
            }
            conn(JSON.stringify(send));
            console.error("Can not find info - "+param);
          }else{
            sendCourseDetails(conn,result_array,"prerequisites")
          }
        });
        return "!ignore";

// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
      
      case "!courseLab": // Course Lab
        readCourseFromBrockData(conn,param,2,dbCache,print,errorlog,function (result_array) {
          if (result_array==null){
            var send = {
              'type': 'text',
              'text': "Can not find info about it",
              'disableInput': false
            }
            conn(JSON.stringify(send));
            console.error("Can not find info - "+param);
          }else{
            sendCourseDetails(conn,result_array,"lab/tut_des")
            sendCourseDetails(conn,result_array,"sem_des")
          }
        });
        return "!ignore";
        
// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!courseExam": // Course
        readCourseFromBrockData(conn,param,2,dbCache,print,errorlog,function (result_array) {
          if (result_array==null){
            var send = {
              'type': 'text',
              'text': "Can not find info about it",
              'disableInput': false
            }
            conn(JSON.stringify(send));
            console.error("Can not find info - "+param);
          }else{
            sendCourseDetails(conn,result_array,"examinfo")
          }
        });
        return "!ignore";
        
// ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～

      case "!courseTerm": // Course
        readCourseFromBrockData(conn,param,2,dbCache,print,errorlog,function (result_array) {
          if (result_array==null){
            var send = {
              'type': 'text',
              'text': "Can not find info about it",
              'disableInput': false
            }
            conn(JSON.stringify(send));
            console.error("Can not find info - "+param);
          }else{
            sendCourseDetails(conn,result_array,"session")
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