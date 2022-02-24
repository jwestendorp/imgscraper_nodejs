import Scraper from 'images-scraper';
import request from 'request';
import fs from 'fs';

const google = new Scraper({
  puppeteer: {
    headless: false,
  },
});

(async () => {
  const results = await google.scrape('banana', 50);
  results.forEach((element,index) => {
    download(element.url, 'data/'+index+'img.png', function(){
    console.log('done');
});
  });
})();

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

