const fs = require('fs');
const csv = require('csv-parser');

module.exports = function (manager, say, save) { 

  // Start
  manager.addDocument('en', 'Get Started', 'agent.start');
  manager.addAnswer('en', 'agent.start', "!json-{\"type\":\"button\",\"text\":\"Welcome! Here are some questions you may ask!\",\"disableInput\":false,\"options\":[{\"text\":\"Tell me about Brock\",\"action\":\"postback\"},{\"text\":\"Where is Brock\",\"action\":\"postback\"},{\"text\":\"What is COSC 4P01\",\"action\":\"postback\"},{\"text\":\"COVID in Niagara\",\"action\":\"postback\"}]}");

  // Brock About
  manager.addNamedEntityText('brocku', 'Brock University', ['en'], ['Brock University','Brock','Brocku','brockuniversity','BU']);
  manager.addDocument('en', 'What is %brocku%', 'brock.about.des');
  manager.addDocument('en', '%brocku%', 'brock.about.des');
  manager.addDocument('en', 'Where is %brocku%', 'brock.about.location');
  manager.addDocument('en', 'How is %brocku%', 'brock.about.des');
  manager.addDocument('en', 'What is the %brocku% Website', 'brock.about.website');
  manager.addDocument('en', 'What’s new at %brocku%', 'brock.about.news');
  manager.addDocument('en', '%brocku% news', 'brock.about.news');
  manager.addDocument('en', 'Covid news at %brocku%', 'agent.covid');
  manager.addDocument('en', 'Tell me about %brocku% Important Dates', 'brock.about.dates');

  manager.addDocument('en', 'Go to %brocku%', 'agent.navigation');
  manager.addDocument('en', 'How can I go to %brocku%', 'agent.navigation');
  manager.addDocument('en', 'What bus should I take to %brocku%', 'agent.navigation');
  manager.addDocument('en', 'Where is %brocku%', 'agent.navigation');
  manager.addDocument('en', 'I want go to %brocku%', 'agent.navigation');
  manager.addAnswer('en', 'agent.navigation', '!navgation-{{navLocation}}');

  manager.addAnswer('en', 'brock.about.des', '!json-{"type":"button","text":"Brock University is one of Canada’s top post-secondary institutions. Located in historic Niagara region, Brock offers all the benefits of a young and modern university in a safe, community-minded city with beautiful natural surroundings.","disableInput":false,"options":[{"text":"About","value":"https://brocku.ca/about/","action":"url"},{"text":"Homepage","value":"https://brocku.ca/","action":"url"},{"text":"News","value":"https://brocku.ca/brock-news/","action":"url"},{"text":"Maps","value":"https://goo.gl/maps/LhZQxd2xQ86LZUAP7","action":"url"}]}');
  manager.addAnswer('en', 'brock.about.location', '!json-{"type":"button","text":"You can reach us at 1812 Sir Isaac Brock Way St. Catharines, ON L2S 3A1 Canada","disableInput":false,"options":[{"text":"Open in Google Maps","value":"https://goo.gl/maps/LhZQxd2xQ86LZUAP7","action":"url"}]}'); //Location
  manager.addAnswer('en', 'brock.about.website', '!json-{"type":"button","text":"The website is https://brocku.ca","disableInput":false,"options":[{"text":"Open brocku.ca","value":"https://brocku.ca","action":"url"}]}');
  manager.addAnswer('en', 'brock.about.news', '!json-{"type":"button","text":"Brock News is here","disableInput":false,"options":[{"text":"Visit","value":"https://brocku.ca/brock-news/","action":"url"}]}');
  manager.addAnswer('en', 'brock.about.dates', '!json-{"type":"button","text":"Brock Important Dates is here","disableInput":false,"options":[{"text":"Visit","value":"https://brocku.ca/important-dates/","action":"url"}]}');
  
  // Brock Program
  manager.addNamedEntityText('brockProgram', 'Computer Science', ['en'], ['CS','Computer Science','ComputerScience','cosc','COSC']);
  manager.addNamedEntityText('brockProgram', 'Dance', ['en'], ['dance']);
  manager.addNamedEntityText('brockProgram', 'Accounting', ['en'], ['accounting']);
  manager.addNamedEntityText('brockProgram', 'Business Accounting', ['en'], ['business accounting']);
  manager.addDocument('en', 'Tell me about the %brockProgram% Program', 'brock.program');
  manager.addDocument('en', 'Tell me about the %brockProgram% Program requirements', 'brock.program.req');
  manager.addDocument('en', 'What is %brockProgram% Program', 'brock.program');

  manager.addAnswer('en', 'brock.program', '!programDes-{{brockProgram}}'); //Des
  manager.addAnswer('en', 'brock.program.req', '!programReq-{{brockProgram}}');

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

  manager.addAnswer('en', 'brock.course.des', '!courseDes-{{brockCourse}}'); //Des
  manager.addAnswer('en', 'brock.course.time', '!courseTime-{{brockCourse}}'); //Time
  manager.addAnswer('en', 'brock.course.location', '!courseLocation-{{brockCourse}}'); //Location
  manager.addAnswer('en', 'brock.course.deliver', '!courseDeliver-{{brockCourse}}');
  manager.addAnswer('en', 'brock.course.prof', '!courseProf-{{brockCourse}}');
  manager.addAnswer('en', 'brock.course.prerequisites', '!coursePrerequisites-{{brockCourse}}');
  manager.addAnswer('en', 'brock.course.lab', '!courseLab-{{brockCourse}}');

  // Course CSV
  //manager.addNamedEntityText('brockCourse', 'COSC-4P01', ['en'], ['COSC 4P01','COSC-4P01','COSC4P01','COSC401','COSC 401']);
  fs.createReadStream(__dirname + '/../../data/train-data/brock/course/data.csv')
    .pipe(csv())
    .on('data', (row) => {
      var course = row[Object.keys(row)].split("\t");
      const courseName1 = course[0].toUpperCase();
      const courseName2 = course[0].toLowerCase();
      const courseName3 = course[0].replace('-', ' ');
      const courseName4 = course[0].toUpperCase().replace('P', '').replace('F', '');
      const courseName5 = course[0].toUpperCase().replace('-', ' ').replace('P', '').replace('F', '');
      const courseName6 = course[0].toUpperCase().replace('-', '').replace('P', '').replace('F', '');
      manager.addNamedEntityText('brockCourse', courseName1, ['en'], [courseName1,courseName2,courseName3,courseName4,courseName5,courseName6]);
      //console.log(course);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
      save(); // Train and save
    });

};