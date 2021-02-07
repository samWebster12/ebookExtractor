const scrapeZLibrary = require('../scrapers/zlibrary-v3');
const scrapePdfDrive = require('../scrapers/pdfdrive-v3');

async function getEbooksController(req, res) {
  const userAgent = req.get('User-Agent');
  const pdfName = req.body.search;

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

  res.status(200).end();
}

module.exports = getEbooksController;
