const scrapeZLibrary = require('../scrapers/zlibrary-v3');
const scrapePdfDrive = require('../scrapers/pdfdrive-v3');
const scrapeLibgen = require('../scrapers/libgen-v3');

async function getEbooksController(req, res) {
  const maxIndex = 16;

  //GET ITEMS OFF BODY
  const userAgent = req.get('User-Agent');
  const pdfName = req.body.search;
  const index = req.body.index;
  const numberOfBooks = req.body.numBooks;

  //SETUP SCRAPERS BASED ON CLIENT INPUT

  if (
    pdfName === undefined ||
    index === undefined ||
    numberOfBooks === undefined
  ) {
    res.status(500).json({ error: 'one of the arguments were missing' });
    return;
  }

  if (index + numberOfBooks > maxIndex) {
    res.status(500).json({
      error: `max index supported is ${maxIndex}. Make sure numBooks and index are less than ${maxIndex}`,
    });

    return;
  }

  if (index < 0) {
    res.status(500).json({
      error: 'Index must be greater than or equal to 0',
    });

    return;
  }
  // const numberOfZLibs = Math.round(numberOfBooks / 2);
  // const numberOfPdfDrives = numberOfBooks - numberOfZLibs;

  const scrapers = [];

  for (let i = 0; i < numberOfBooks; i++) {
    scrapers.push(scrapeZLibrary);
  }
  for (let i = 0; i < numberOfBooks; i++) {
    scrapers.push(scrapePdfDrive);
  }

  for (let i = 0; i < numberOfBooks; i++) {
    scrapers.push(scrapeLibgen);
  }

  const headers = {
    'User-Agent': userAgent,
  };

  //DO SCRAPING AND WRITE BACK RESULTS IN RESPONSE OBJECT
  let pdfDriveIndex = index - 1;
  let zLibraryIndex = index - 1;
  let libgenIndex = index - 1;
  const promises = scrapers.map(async (scraper) => {
    try {
      const resource = await scraper(
        pdfName,
        headers,
        scraper.name === 'scrapeZLibrary'
          ? ++zLibraryIndex
          : scraper.name === 'scrapePdfDrive'
          ? ++pdfDriveIndex
          : ++libgenIndex,
      );

      res.write(
        `${resource.link}---${resource.fileFormat}---${resource.source}---${resource.title}---${resource.author}---${resource.pageCount}---${resource.imgLink}<-->`,
      );
    } catch (error) {
      console.log(error.message);
      res.write('ERROR');
      return error;
    }
  });

  await Promise.all(promises);

  res.status(200).end();
}

module.exports = getEbooksController;
