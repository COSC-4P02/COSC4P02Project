const { parse } = require('rss-to-json');

// Brock News RSS

module.exports = function (dbCache, print, errorlog, result) { 

	var sent = false;
	const db_news_loc = "/crawler/data/brock/news";
	try{
		var rss_cache = dbCache.getData(db_news_loc);
		if (rss_cache.length > 0 || rss_cache.title != 'failed'){
			print("Crawler: Brock News RSS Read from database");
			result(rss_cache);
			sent = true;
		}
	}catch(e){
		print("Crawler: No data from cache database - "+db_news_loc);
	}
	
	parse('https://brocku.ca/brock-news/feed/').then(rss => {
		if (rss.title != 'failed'){
			dbCache.push(db_news_loc, rss);
			print("Crawler: Brock News RSS Read Successfully | Saved to database");
		}else{
			errorlog("Crawler: Brock News RSS Read Error");
			errorlog(JSON.stringify(rss, null, 3));
		}
		if (!sent) result(rss);
	});

}