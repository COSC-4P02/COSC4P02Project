module.exports = function (manager, say, dbCache, save) { 
  var json_a_temp;

  // Start
  manager.addDocument('en', 'Get Started', 'agent.start');
  manager.addDocument('en', 'Is anyone available to chat?', 'agent.start');
  manager.addDocument('en', 'What can you do', 'agent.start');
  json_a_temp = {
    "type":"button",
    "text": "Welcome! Here are some questions you may ask!",
    "disableInput":false,
    "options":[
      {"text":"Tell me about Brock","action":"postback"},
      {"text":"Where is Brock","action":"postback"},
      {"text":"What is COSC 4P01","action":"postback"},
      {"text":"COVID in Niagara","action":"postback"},
      {"text":"Tell me about the Accounting Program","action":"postback"},
      {"text":"Where is Zone 1","action":"postback"}
    ]
  }
  manager.addAnswer('en', 'agent.start', "!json-"+JSON.stringify(json_a_temp));

  // Strange Questions
  manager.addDocument('en', 'what is the school\'s name', 'brock.strange.schoolname');
  manager.addAnswer('en', 'brock.strange.schoolname', 'Brock University');

  // Brock About
  manager.addNamedEntityText('brocku', 'Brock University', ['en'], ['Brock University','Brock','Brocku','brockuniversity','BU']);
  manager.addDocument('en', 'What is %brocku%', 'brock.about.des');
  manager.addDocument('en', 'Tell me about %brocku%', 'brock.about.des');
  manager.addDocument('en', '%brocku%', 'brock.about.des');
  manager.addDocument('en', 'Where is %brocku%', 'brock.about.location');
  manager.addDocument('en', 'Go to %brocku%', 'brock.about.location');
  manager.addDocument('en', 'How is %brocku%', 'brock.about.des');
  manager.addDocument('en', 'What is the %brocku% Website', 'brock.about.website');
  manager.addDocument('en', 'What’s new at %brocku%', 'brock.about.news');
  manager.addDocument('en', '%brocku% news', 'brock.about.news');
  manager.addDocument('en', 'Covid news at %brocku%', 'agent.covid');
  manager.addDocument('en', 'Tell me about %brocku% Important Dates', 'brock.about.dates');

  manager.addAnswer('en', 'brock.about.des', '!json-{"type":"button","text":"Brock University is one of Canada’s top post-secondary institutions. Located in historic Niagara region, Brock offers all the benefits of a young and modern university in a safe, community-minded city with beautiful natural surroundings.","disableInput":false,"options":[{"text":"About","value":"https://brocku.ca/about/","action":"url"},{"text":"Homepage","value":"https://brocku.ca/","action":"url"},{"text":"News","value":"https://brocku.ca/brock-news/","action":"url"},{"text":"Maps","value":"https://goo.gl/maps/LhZQxd2xQ86LZUAP7","action":"url"}]}');
  manager.addAnswer('en', 'brock.about.location', '!json-{"type":"button","text":"You can reach us at 1812 Sir Isaac Brock Way St. Catharines, ON L2S 3A1 Canada","disableInput":false,"options":[{"text":"Open in Google Maps","value":"https://goo.gl/maps/LhZQxd2xQ86LZUAP7","action":"url"}]}'); //Location
  manager.addAnswer('en', 'brock.about.website', '!json-{"type":"button","text":"The website is https://brocku.ca","disableInput":false,"options":[{"text":"Open brocku.ca","value":"https://brocku.ca","action":"url"}]}');
  manager.addAnswer('en', 'brock.about.news', '!json-{"type":"button","text":"You can now simply ask me about Brock News","extra":"news","disableInput":false,"options":[{"text":"Visit","value":"https://brocku.ca/brock-news/","action":"url"},{"text":"Exit News Search","value":"Exit News Search","action":"postback"}]}');
  manager.addAnswer('en', 'brock.about.dates', '!json-{"type":"button","text":"Brock Important Dates is here","disableInput":false,"options":[{"text":"Visit","value":"https://brocku.ca/important-dates/","action":"url"}]}');

  // Courses Details
  manager.addDocument('en', 'What is %brockCourse%', 'brock.course.des');
  manager.addDocument('en', 'Tell me about %brockCourse%', 'brock.course.des');
  manager.addDocument('en', 'I want to know about %brockCourse%', 'brock.course.des');
  manager.addDocument('en', '%brockCourse%', 'brock.course.des');

  manager.addDocument('en', 'When is %brockCourse%', 'brock.course.time');
  manager.addDocument('en', '%brockCourse% time', 'brock.course.time');

  manager.addDocument('en', 'Where is %brockCourse%', 'brock.course.location');
  manager.addDocument('en', '%brockCourse% Location', 'brock.course.location');
  
  manager.addDocument('en', 'How is the %brockCourse% delivered', 'brock.course.deliver');
  manager.addDocument('en', '%brockCourse% deliver method', 'brock.course.deliver');
  manager.addDocument('en', '%brockCourse% lecture', 'brock.course.deliver');

  manager.addDocument('en', 'Who teaches %brockCourse%', 'brock.course.prof');
  manager.addDocument('en', '%brockCourse% Professor', 'brock.course.prof');

  manager.addDocument('en', 'What are the Prerequisites for %brockCourse%', 'brock.course.prerequisites');
  manager.addDocument('en', '%brockCourse% Prerequisites', 'brock.course.prerequisites');

  manager.addDocument('en', 'What are the lab options for %brockCourse%', 'brock.course.lab');
  manager.addDocument('en', '%brockCourse% lab', 'brock.course.lab');
  manager.addDocument('en', 'What are the seminers options for %brockCourse%', 'brock.course.lab');
  manager.addDocument('en', '%brockCourse% seminer', 'brock.course.lab');
  manager.addDocument('en', 'What are the sem options for %brockCourse%', 'brock.course.lab');
  manager.addDocument('en', '%brockCourse% sem', 'brock.course.lab');

  manager.addDocument('en', 'Tell me about the %brockCourse% exam', 'brock.course.exam');
  manager.addDocument('en', '%brockCourse% exam', 'brock.course.exam');
  manager.addDocument('en', 'What time is the %brockCourse% exam', 'brock.course.exam');
  manager.addDocument('en', '%brockCourse% exam time', 'brock.course.exam');
  manager.addDocument('en', 'Where is the %brockCourse% exam', 'brock.course.exam');
  manager.addDocument('en', '%brockCourse% exam location', 'brock.course.exam');

  manager.addDocument('en', 'What term is %brockCourse%', 'brock.course.term');
  manager.addDocument('en', '%brockCourse% term', 'brock.course.term');

  manager.addAnswer('en', 'brock.course.des', '!courseDes-{{brockCourse}}'); //Des
  manager.addAnswer('en', 'brock.course.time', '!courseTime-{{brockCourse}}'); //Time
  manager.addAnswer('en', 'brock.course.location', '!courseLocation-{{brockCourse}}'); //Location
  manager.addAnswer('en', 'brock.course.deliver', '!courseDeliver-{{brockCourse}}');
  manager.addAnswer('en', 'brock.course.prof', '!courseProf-{{brockCourse}}');
  manager.addAnswer('en', 'brock.course.prerequisites', '!coursePrerequisites-{{brockCourse}}');
  manager.addAnswer('en', 'brock.course.lab', '!courseLab-{{brockCourse}}');
  manager.addAnswer('en', 'brock.course.exam', '!courseExam-{{brockCourse}}');
  manager.addAnswer('en', 'brock.course.term', '!courseTerm-{{brockCourse}}');

  // Brock Programs
  const brockPrograms = require('../crawler/brockPrograms');
  const programs_nlp = brockPrograms();
  for (var i in programs_nlp){
    if (programs_nlp[i]=="Krunk") continue;
    var program = programs_nlp[i].title;
    const case1 = program.toUpperCase();
    const case2 = program.toLowerCase();
    const case3 = program.replace(' ', '');
    const case4 = program.toLowerCase().replace(' ', '');
    manager.addDocument('en', case1, 'brock.program.general.'+case4);
    manager.addDocument('en', case1 + ' program', 'brock.program.general.'+case4);
    manager.addDocument('en', case2 + ' program', 'brock.program.general.'+case4);
    manager.addDocument('en', case3 + ' program', 'brock.program.general.'+case4);
    manager.addDocument('en', case4 + ' program', 'brock.program.general.'+case4);
    manager.addAnswer('en', 'brock.program.general.'+case4, programs_nlp[i].nlp);
  }

  manager.addDocument('en', "All Programs", 'brock.program.general');
  manager.addDocument('en', "Programs", 'brock.program.general');
  json_a_temp = {
    "type":"button",
    "text":"As a comprehensive university, Brock has an expansive selection of undergraduate programs as well as advanced research, post-graduate and doctoral options.",
    "disableInput":false,
    "options":[{"text":"Programs List","value":"https://brocku.ca/programs/","action":"url"}]
  }
  manager.addAnswer('en', 'brock.program.general', "!json-"+JSON.stringify(json_a_temp));

  manager.addDocument('en', "How many Programs", 'brock.program.count');
  json_a_temp = {
    "type":"button",
    "text":"There are total of "+programs_nlp.length+" Programs in Brock University",
    "disableInput":false,
    "options":[{"text":"Programs List","value":"https://brocku.ca/programs/","action":"url"}]
  }
  manager.addAnswer('en', 'brock.program.count', "!json-"+JSON.stringify(json_a_temp));

  // Course Data
  const brockData = require('../crawler/brockData');
  const brockData_data = brockData();
  for (var key in brockData_data) {
    if (key=="Krunk") continue;
    var course = key;
    const courseName1 = course.toUpperCase();
    const courseName2 = course.toLowerCase();
    const courseName3 = course.replace('-', ' ');
    const courseName4 = course.toUpperCase().replace('P', '').replace('F', '');
    const courseName5 = course.toUpperCase().replace('-', ' ').replace('P', '').replace('F', '');
    const courseName6 = course.toUpperCase().replace('-', '').replace('P', '').replace('F', '');
    manager.addNamedEntityText('brockCourse', course, ['en'], [courseName1,courseName2,courseName3,courseName4,courseName5,courseName6]);
  }

  manager.addDocument('en', "How many Courses", 'brock.course.count');
  json_a_temp = {
    "type":"button",
    "text":"There are total of "+Object.keys(brockData_data).length+" Programs in Brock University",
    "disableInput":false,
    "options":[{"text":"Timetables List","value":"https://brocku.ca/guides-and-timetables/timetables/","action":"url"}]
  }
  manager.addAnswer('en', 'brock.course.count', "!json-"+JSON.stringify(json_a_temp));

  save(); // Train and save

};