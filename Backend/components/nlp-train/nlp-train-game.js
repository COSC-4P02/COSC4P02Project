const csv = require("csvtojson");

module.exports = async function (manager, say, dbCache, save) { 
    var json_a_temp, i, jsonArray;

    // Start
    manager.addDocument('en', 'Get Started', 'agent.start');
    json_a_temp = {
            "type":"button",
            "text": "Welcome! Here are some questions you may ask!",
            "disableInput":false,
            "options":[
                {"text":"Tell me about Canada Games","action":"postback"},
                {"text":"Where can I buy tickets?","action":"postback"},
                {"text":"How Long until the Canada Games Start","action":"postback"},
                {"text":"How many medals does Ontario have?","action":"postback"},
                {"text":"COVID in Niagara","action":"postback"},
                {"text":"Whats new with the Canada Games","action":"postback"}
            ]
        }
    manager.addAnswer('en', 'agent.start', "!json-"+JSON.stringify(json_a_temp));

	// Canada Game
	manager.addDocument('en', 'canada game', 'agent.cginfo');
	manager.addDocument('en', 'i want to know about canada game', 'agent.cginfo');
    manager.addDocument('en', 'what is canada game', 'agent.cginfo');
    manager.addDocument('en', 'when is canada game', 'agent.cginfo');
    manager.addAnswer('en', 'agent.cginfo', "The Canada Summer Games are coming to the Niagara Region August 6-21, 2022! These Games will feature approximately 5,000 athletes and coaches in 18 sports from all 13 Provinces and Territories. 4,000 volunteers will be needed to deliver these Games and the expected economic impact will exceed $450 million.");

    // Ticket
    manager.addDocument('en', 'Where can I buy tickets?', 'game.ticket');
    manager.addDocument('en', 'ticket', 'game.ticket');
    manager.addAnswer('en', 'game.ticket', '!json-{"type":"button","text":"You can find ticket infomation here","disableInput":false,"options":[{"text":"About Ticket","value":"https://niagara2022games.ca/tickets","action":"url"},{"text":"Purchase Tickets","value":"https://tournkey.app/dashboard/ticket/events/e9GN0yhYf5wRy5VCIa5HsQ","action":"url"}]}');
    
    // Website
    manager.addDocument('en', 'What is the Canada Games Website', 'game.website');
    manager.addAnswer('en', 'game.website', '!json-{"type":"button","text":"The official website to Canada Games is canadagames.ca","disableInput":false,"options":[{"text":"Canada Games","value":"http://canadagames.ca","action":"url"},{"text":"Niagara 2022 Games","value":"https://niagara2022games.ca/","action":"url"}]}');
    
    // Countdown
    manager.addDocument('en', 'How Long until the Canada Games Start', 'game.countdown');
    manager.addDocument('en', 'Count Down', 'game.countdown');
    manager.addDocument('en', 'Countdown', 'game.countdown');
    manager.addDocument('en', 'Canada Games Start', 'game.countdown');
    manager.addAnswer('en', 'game.countdown', '!gameCountdown-');

    // News
    manager.addDocument('en', 'Whats new with the Canada Games', 'game.news');
    manager.addDocument('en', 'News', 'game.news');
    manager.addAnswer('en', 'game.news', '!news-');

    // Location
    manager.addNamedEntityText('cgames', 'Canada Games', ['en'], ['Canada Games','CanadaGames','CG','Canada Game','CanadaGame']);
    manager.addDocument('en', 'Where is %cgames%', 'game.about.location');
    manager.addAnswer('en', 'game.about.location', '!json-{"type":"button","text":"The Niagara 2022 Canada Summer Games is taking place in Ontario\'s Niagara Region","disableInput":false,"options":[{"text":"Open in Google Maps","value":"https://www.google.com/maps/place/43°06\'57.3%22N+79°14\'40.7%22W/@43.115902,-79.246143,17z/data=!3m1!4b1!4m14!1m7!3m6!1s0x0:0xe37525e6516e34c9!2zNDPCsDA4JzIxLjAiTiA3OcKwMTQnMDEuOCJX!3b1!8m2!3d43.1391743!4d-79.2338363!3m5!1s0x0:0x2b8900f2cfaa8a23!7e2!8m2!3d43.115902!4d-79.2446335","action":"url"}]}');

    // Medals
    const fs = require('fs');
    let cg_result = fs.readFileSync('data/train-data/game/cg_result.json');
    let cg_result_data = JSON.parse(cg_result);
    for (i = 0; i < cg_result_data.length; i++) {
        var gold = parseInt(cg_result_data[i]['summergames']['gold'])+parseInt(cg_result_data[i]['wintergames']['gold'])
        var silver = parseInt(cg_result_data[i]['summergames']['silver'])+parseInt(cg_result_data[i]['wintergames']['silver'])
        var bronze = parseInt(cg_result_data[i]['summergames']['bronze'])+parseInt(cg_result_data[i]['wintergames']['bronze'])

        manager.addDocument('en', 'How many medals does '+cg_result_data[i]['name']+" have", 'game.medal.'+cg_result_data[i]['name'].toLowerCase().replace(" ",""));
        manager.addDocument('en', 'medals '+cg_result_data[i]['name'], 'game.medal.'+cg_result_data[i]['name'].toLowerCase().replace(" ",""));
        json_a_temp = {
            "type":"button",
            "text": cg_result_data[i]['name']+" currently has "+cg_result_data[i]['total']+" medals, "+gold+" gold, "+silver+" silver and "+bronze+" bronze medals",
            "disableInput":false,
            "options":[{"text":"View Online","value":cg_result_data[i]['links'],"action":"url"}]
        }
        manager.addAnswer('en', 'game.medal.'+cg_result_data[i]['name'].toLowerCase().replace(" ",""), "!json-"+JSON.stringify(json_a_temp));


        manager.addDocument('en', 'gold medals '+cg_result_data[i]['name']+" have", 'game.medal.gold.'+cg_result_data[i]['name'].toLowerCase().replace(" ",""));
        json_a_temp = {
            "type":"button",
            "text": cg_result_data[i]['name']+" currently has "+gold+" gold medals",
            "disableInput":false,
            "options":[{"text":"View Online","value":cg_result_data[i]['links'],"action":"url"}]
        }
        manager.addAnswer('en', 'game.medal.gold.'+cg_result_data[i]['name'].toLowerCase().replace(" ",""), "!json-"+JSON.stringify(json_a_temp));

        manager.addDocument('en', 'silver medals '+cg_result_data[i]['name']+" have", 'game.medal.silver.'+cg_result_data[i]['name'].toLowerCase().replace(" ",""));
        json_a_temp = {
            "type":"button",
            "text": cg_result_data[i]['name']+" currently has "+silver+" silver medals",
            "disableInput":false,
            "options":[{"text":"View Online","value":cg_result_data[i]['links'],"action":"url"}]
        }
        manager.addAnswer('en', 'game.medal.silver.'+cg_result_data[i]['name'].toLowerCase().replace(" ",""), "!json-"+JSON.stringify(json_a_temp));

        manager.addDocument('en', 'bronze medals '+cg_result_data[i]['name']+" have", 'game.medal.bronze.'+cg_result_data[i]['name'].toLowerCase().replace(" ",""));
        json_a_temp = {
            "type":"button",
            "text": cg_result_data[i]['name']+" currently has "+bronze+" bronze medals",
            "disableInput":false,
            "options":[{"text":"View Online","value":cg_result_data[i]['links'],"action":"url"}]
        }
        manager.addAnswer('en', 'game.medal.bronze.'+cg_result_data[i]['name'].toLowerCase().replace(" ",""), "!json-"+JSON.stringify(json_a_temp));
    }

    // Athletes
    manager.addDocument('en', 'Tell me about the %athletes%', 'game.athletes.info');
    manager.addDocument('en', 'Who is %athletes%', 'game.athletes.info');
    manager.addDocument('en', '%athletes%', 'game.athletes.info');
    manager.addDocument('en', 'What sport did %athletes% play', 'game.athletes.info');
    manager.addDocument('en', 'How many players', 'game.athletes.count');
    manager.addDocument('en', 'How many athletes', 'game.athletes.count');

    manager.addAnswer('en', 'game.athletes.info', '!athletesInfo-{{athletes}}');

    var csvFilePath = "data/train-data/game/2015version.csv";
    jsonArray=await csv().fromFile(csvFilePath);
    jsonArray = JSON.parse(JSON.stringify(jsonArray, 1), 1);
    
    for (i = 0; i < jsonArray.length; i++) {
        var name = jsonArray[i]['name'];
        const name1 = name.toUpperCase();
        const name2 = name.toLowerCase();
        const name3 = name.toLowerCase().replace(' ', '');
        const name4 = name.toLowerCase().replace(',', '');

        manager.addNamedEntityText('athletes', name, ['en'], [name1,name2,name3,name4]);
    }
    manager.addNamedEntityText('athletes', "Sidney Crosby", ['en'], ["Sidney Crosby"]);
    manager.addAnswer('en', 'game.athletes.count', jsonArray.length+" Players in 2015 Canada Games Database.");

    save();
};