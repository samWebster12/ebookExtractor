const inqConsole = require('./utils/inqConsole');
const scrapePdfDrive = require('./scrapers/pdfdrive-v3');
const scrapeZLibrary = require('./scrapers/zlibrary-v3');

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
  const scrapers = [scrapePdfDrive, scrapeZLibrary];
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
  };

  let promises = scrapers.map((scraper) => scraper(pdfName, headers, 0));
  Promise.all(promises).then((results) => {
    inqConsole(results);
  });
})();
