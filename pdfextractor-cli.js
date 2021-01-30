const inqConsole = require('./utils/inqConsole');
const scrapePdfDrive = require('./scrapers/pdfdrive-v3');
const scrapeZLibrary = require('./scrapers/zlibrary-v3');
const EbookResource = require('./classes/EbookResource');

let pdfName;

//Get pdf name from third console argument
if (!process.argv[2] || process.argv[3]) {
  console.log(
    `Please provide a single argument for the pdf you are searching for!
    Wrap your ebook title with double quotation marks if you need to!`,
  );
  process.exit();
} else {
  pdfName = process.argv[2];
}

(async function () {
  const scrapers = [
    scrapeZLibrary,
    scrapeZLibrary,
    scrapeZLibrary,
    scrapePdfDrive,
    scrapePdfDrive,
  ];
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
  };

  let index = -1;
  const promises = scrapers.map((scraper) => {
    index++;

    return scraper(pdfName, headers, index).catch((err) => {
      console.log('error occured');
      return err;
    });
  });

  Promise.all(promises)
    .then((results) => {
      const newResults = [];
      results.forEach((result) => {
        if (result instanceof EbookResource) {
          newResults.push(result);
        }
      });
      inqConsole(newResults);
    })
    .catch('saw it');
})();
