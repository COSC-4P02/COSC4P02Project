module.exports = function (manager, say, dbCache, save) { 
    // Start
    manager.addDocument('en', 'Get Started', 'agent.start');
    manager.addAnswer('en', 'agent.start', "!json-{\"type\":\"button\",\"text\":\"Welcome! Here are some questions you may ask!\",\"disableInput\":false,\"options\":[{\"text\":\"Tell me about Canada Games\",\"action\":\"postback\"},{\"text\":\"How Long until the Canada Games Start\",\"action\":\"postback\"},{\"text\":\"Where can I buy tickets?\",\"action\":\"postback\"},{\"text\":\"COVID in Niagara\",\"action\":\"postback\"}]}");

	// Canada Game
	manager.addDocument('en', 'canada game', 'agent.cginfo');
	manager.addDocument('en', 'i want to know about canada game', 'agent.cginfo');
    manager.addDocument('en', 'what is canada game', 'agent.cginfo');
    manager.addDocument('en', 'when is canada game', 'agent.cginfo');
    manager.addAnswer('en', 'agent.cginfo', "The Canada Summer Games are coming to the Niagara Region August 6-21, 2022! These Games will feature approximately 5,000 athletes and coaches in 18 sports from all 13 Provinces and Territories. 4,000 volunteers will be needed to deliver these Games and the expected economic impact will exceed $450 million.");

    manager.addDocument('en', 'Where can I buy tickets?', 'game.ticket');
    manager.addDocument('en', 'ticket', 'game.ticket');
    manager.addAnswer('en', 'game.ticket', '!json-{"type":"button","text":"You can find ticket infomation here","disableInput":false,"options":[{"text":"About Ticket","value":"https://niagara2022games.ca/tickets","action":"url"},{"text":"Purchase Tickets","value":"https://tournkey.app/dashboard/ticket/events/e9GN0yhYf5wRy5VCIa5HsQ","action":"url"}]}');
    
    manager.addDocument('en', 'What is the Canada Games Website', 'game.website');
    manager.addAnswer('en', 'game.website', '!json-{"type":"button","text":"The official website to Canada Games is canadagames.ca","disableInput":false,"options":[{"text":"Canada Games","value":"http://canadagames.ca","action":"url"},{"text":"Niagara 2022 Games","value":"https://niagara2022games.ca/","action":"url"}]}');
    
    manager.addDocument('en', 'How Long until the Canada Games Start', 'game.countdown');
    manager.addDocument('en', 'Count Down', 'game.countdown');
    manager.addDocument('en', 'Countdown', 'game.countdown');
    manager.addDocument('en', 'Canada Games Start', 'game.countdown');
    manager.addAnswer('en', 'game.countdown', '!gameCountdown-');

    manager.addDocument('en', 'Whats new with the Canada Games', 'game.news');
    manager.addDocument('en', 'News', 'game.news');
    manager.addAnswer('en', 'game.news', '!news-');
    
    save();
};