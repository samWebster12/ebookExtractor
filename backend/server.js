const express = require('express');
const path = require('path');
const scrapeZLibrary = require('./scrapers/zlibrary-v3');
const scrapePdfDrive = require('./scrapers/pdfdrive-v3');

//SETUP
const PORT = 8080;
const server = express();
server.use(express.static(path.join(__dirname, 'views')));
server.use(express.json());

//CORS
server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //'http://localhost:3000'
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

//ROUTES
server.get('/', (req, res) => {
  console.log('happened');
  res.render('index.html');
  res.end();
});

server.post('/data', async (req, res) => {
  const userAgent = req.get('User-Agent');
  const pdfName = req.body.searchbox;

  const scrapers = [
    scrapeZLibrary,
    scrapeZLibrary,
    scrapePdfDrive,
    scrapePdfDrive,
    scrapeZLibrary,
  ];
  const headers = {
    'User-Agent': userAgent,
  };

  let pdfDriveIndex = -1;
  let zLibraryIndex = -1;
  const promises = scrapers.map(async (scraper) => {
    try {
      const resource = await scraper(
        pdfName,
        headers,
        scraper.name === 'scrapeZLibrary' ? ++zLibraryIndex : ++pdfDriveIndex,
      );
      res.write(resource.link);
      res.write('<-->');
    } catch (error) {
      console.log(error.message);
      return error;
    }
  });

  await Promise.all(promises);

  res.end();
});

//LISTEN
server.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
/*
async function ebookController(scrapers, headers, pdfName, resObj) {
  return new Promise(async (resolve, reject) => {
    let pdfDriveIndex = -1;
    let zLibraryIndex = -1;
    try {
      const promises = scrapers.map(async (scraper) => {
        try {
          const resource = await scraper(
            pdfName,
            headers,
            scraper.name === 'scrapeZLibrary'
              ? ++zLibraryIndex
              : ++pdfDriveIndex,
          );
          resObj.write(resource.link);
          resObj.write('<-->');
        } catch (error) {
          console.log(error.message);
          return error;
        }
      });

      await Promise.all(promises);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
*/
