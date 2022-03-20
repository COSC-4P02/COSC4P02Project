const { parse, Parse } = require('./dist');

(async () => {
   var rss = await parse('https://brocku.ca/brock-news/feed/');
   console.log(JSON.stringify(rss, null, 3));
})();