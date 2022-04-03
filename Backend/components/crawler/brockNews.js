const axios = require('axios').default;
const { parse } = require('../../plugin/rss-to-json/dist/');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var { stats_one } = require('../statsService');

// Brock News RSS

// async function get_news_content(axiosArray2, all_news,count,result){
// 	const axiosArray = [...axiosArray2];
// 	if (count>=all_news.length){
// 		result(all_news)
// 		return
// 	}
// 	var half;
// 	const cut = 1;
// 	if (count+cut<=all_news.length){
// 		half = axiosArray.splice(count, count+cut)
// 		console.log(count, count+cut);
// 	}else{
// 		half = axiosArray.splice(count, all_news.length)
// 		console.log(count, all_news.length);
// 	}
// 	//console.log(half);

// 	axios
// 		.all(half)
// 		.then(axios.spread((...responses) => {
// 			responses.forEach(res => {
// 				//console.log(res.data)
// 				const dom = new JSDOM(res.data);
// 				const total_array = dom.window.document.querySelectorAll('.the-content');
// 				//console.log("c"+total_array.length);
// 				for (const item of total_array){
// 					all_news[count]['content']=item.textContent.trim();
// 					//console.log(item.textContent.trim())
// 				}
// 				count++;
// 			})
// 			//count++; //delete
// 			console.log(count)

// 			get_news_content(axiosArray2, all_news,count,result)

// 			//result(all_news);
// 		}))
// 		.catch(error => {console.log(error);})
// }

module.exports = function (type, parma, noFetch, dbMain, dbCache, print, errorlog, result) { 
	var sent = false;

	if(type === 'rss'){
		stats_one(print, errorlog, dbMain, "api/crawler/brockNews/rss");
		const db_news_loc = "/crawler/data/brock/news/recent";
		const db_loc_date = "/crawler/data/brock/news/date";
		const cache_max_time = 0.1; // Max cache time (Hour)
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

		if (sent&&noFetch) return

		if (sent){
			try{
				var data_cache_date = dbCache.getData(db_loc_date);
				const expire_timer = new Date(data_cache_date) - (new Date());
				const expire_timer_format = "PassTime: "+(expire_timer/1000/60*-1).toFixed(2)+" Min";
				if (expire_timer >= (-1000 * 60 * 60 * cache_max_time)){
					print("Crawler: RSS Skip Fetch | "+expire_timer_format);
					return
				}
			}catch(e){
				print("Crawler: No data from cache database - "+db_loc_date);
			}
		}
		
		parse('https://brocku.ca/brock-news/feed/').then(rss => {

			if (rss.title != 'failed'){
				var endpoints = []
				for (const item of rss.items) {
					const link = item.link;
					endpoints.push(link);
				}

				axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
				(data) => {
					var count = 0
					for (const item of data) {
						const dom = new JSDOM(item.data);
						try{
							rss.items[count]['image'] = dom.window.document.querySelector('.main-image').href
						}catch(e){
							rss.items[count]['image'] = "https://brocku.ca/brock-news/wp-content/uploads/2018/11/Brock-University-Campus-LR-1600x899.jpg?";
						}
						count++;
					}
					dbCache.push(db_news_loc, rss);
					dbCache.push(db_loc_date, new Date());
					print("Crawler: Brock News RSS Read Successfully | Saved to database");
					if (!sent) result(rss);
				},
				);

				
			}else{
				errorlog("Crawler: Brock News RSS Read Error");
				errorlog(JSON.stringify(rss, null, 3));
				rss = rss_cache;
				if (!sent) result(rss);
			}
		});
	}else if(type === 'all'){
		stats_one(print, errorlog, dbMain, "api/crawler/brockNews");

		const db_news_loc = "/crawler/data/brock/news_all";

		try{
			var all_news_cache = dbCache.getData(db_news_loc);
			if (all_news_cache.length > 0 || all_news_cache.title != 'failed'){
				print("Crawler: Brock News All Read from database");
				result(all_news_cache);
				sent = true;
			}
		}catch(e){
			print("Crawler: No data from cache database - "+db_news_loc);
		}

		if (sent&&noFetch) return

		axios.get('https://brocku.ca/brock-news/category/news/')
			.then(function (response) {
			const dom = new JSDOM(response.data);
			const total_array = dom.window.document.querySelectorAll('.page-numbers');
			var largest_page = 0;
			for (const item of total_array){
				if (!isNaN(parseInt(item.textContent, 10)) && parseInt(item.textContent, 10) > largest_page){
					largest_page = parseInt(item.textContent, 10)
				}
			}
			//console.log(largest_page);

			//largest_page = 1

			let newPromise = axios({
				method: 'get',
				url: 'https://brocku.ca/brock-news/category/news/'
			})

			let axiosArray = [newPromise]
			for (var x = 2; x <= largest_page; x++) {
				let newPromise = axios({
					method: 'get',
					url: 'https://brocku.ca/brock-news/category/news/page/'+x+'/'
				})
				axiosArray.push(newPromise)
			}

			print("Crawler: Fetching news - " + largest_page + " pages");

			var all_news = []

			axios
				.all(axiosArray)
				.then(axios.spread((...responses) => {
				responses.forEach(res => {
					const dom = new JSDOM(res.data);
					const total_array = dom.window.document.querySelectorAll('#loop-list li div h2 a');
					for (const item of total_array){
						const data = {
							'title':item.textContent,
							'href':item.href
						}
						all_news.push(data)
					}
				})
				print('Crawler: All News Fetching Complete - ' + all_news.length + " Total news");

				//    let axiosArray2 = []
				//    for (const item of all_news) {
				//   let newPromise = axios({
				//       method: 'get',
				//       url: item.href
				//     })
				//   axiosArray2.push(newPromise)
				//   //console.log(item.href)
				// }

				// print('Crawler: Starting content fetch');

				// setTimeout(() => {
				// 	get_news_content(axiosArray2, all_news, 0, function (all_news) {
				//    				print('Crawler: All News Content Fetching Complete - ' + all_news.length + " Total news");
						// 		dbCache.push(db_news_loc, all_news);
				//  			});
				// }, 15000);
				//print('Crawler: All News Content Fetching Complete - ' + all_news.length + " Total news");

				dbCache.push(db_news_loc, all_news);
				if (!sent) result(all_news);
				}))
				.catch(error => {console.log(error);})
			})
	}else if(type === 'search'){
		stats_one(print, errorlog, dbMain, "api/crawler/brockNews/search");
		var all_news=[]
		axios.get('https://brocku.ca/brock-news/?s='+parma.replace(' ','+'))
			.then(function (res) {
			// console.log(res);
			const dom = new JSDOM(res.data);
			const total_array = dom.window.document.querySelectorAll('#loop-list li div h2 a');
			for (const item of total_array){
				const data = {
					'title':item.textContent,
					'href':item.href
				}
				all_news.push(data);
			}
			result(all_news);
		})
		.catch(function (error) {console.log(error);})
	}
	// else if(type === 'details'){
	// 	try{
	// 		const db_news_loc = "/crawler/data/brock/news_all";
	// 		var all_news_cache = dbCache.getData(db_news_loc);
	// 		if (all_news_cache.length > 0 || all_news_cache.title != 'failed'){
	// 			print("Crawler: Brock News All Read from database");
	// 			//result(all_news_cache);
	// 			sent = true;
	// 		}
	// 	}catch(e){
	// 		print("Crawler: No data from cache database - "+db_news_loc);
	// 		result('{"success":"false"}')
	// 	}

	// 	var all_news = all_news_cache;

	// 	const db_news_loc = "/crawler/data/brock/news_all_details";
	// 	try{
	// 		var all_news_cache = dbCache.getData(db_news_loc);
	// 		if (all_news_cache.length > 0 || all_news_cache.title != 'failed'){
	// 			print("Crawler: Brock News All Read from database");
	// 			result(all_news_cache);
	// 			sent = true;
	// 		}
	// 	}catch(e){
	// 		print("Crawler: No data from cache database - "+db_news_loc);
	// 	}

	// 	   let axiosArray2 = []
	// 		    for (const item of all_news) {
	// 			  let newPromise = axios({
	// 			      method: 'get',
	// 			      url: item.href
	// 			    })
	// 			  axiosArray2.push(newPromise)
	// 			  //console.log(item.href)
	// 			}

	// 			print('Crawler: Starting content fetch');
	// 				get_news_content(axiosArray2, all_news, 0, function (all_news) {
	//       				print('Crawler: All News Content Fetching Complete - ' + all_news.length + " Total news");
	// 					dbCache.push(db_news_loc, all_news);
	// 					if (!sent) result(all_news);
	// 					print('Crawler: All News Content Fetching Complete - ' + all_news.length + " Total news");
	//     			});
	// }

	

}