module.exports = function (manager, say, dbCache, save) { 

	// Canada Game
	manager.addDocument('en', 'canada game', 'agent.cginfo');
	manager.addDocument('en', 'i want to know about canada game', 'agent.cginfo');
    manager.addDocument('en', 'what is canada game', 'agent.cginfo');
    manager.addDocument('en', 'when is canada game', 'agent.cginfo');

    manager.addAnswer('en', 'agent.cginfo', "The Canada Summer Games are coming to the Niagara Region August 6-21, 2022! These Games will feature approximately 5,000 athletes and coaches in 18 sports from all 13 Provinces and Territories. 4,000 volunteers will be needed to deliver these Games and the expected economic impact will exceed $450 million.");

    save();
};