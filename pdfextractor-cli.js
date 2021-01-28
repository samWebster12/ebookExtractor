const inqConsole = require("./utils/inqConsole");
const scrapePdfDrive = require("./oldFiles/scrapers/pdfdrive");
const scrapeZLibrary = require("./oldFiles/scrapers/zlibrary");

let pdfName;

//Get pdf name from third console argument
if (!process.argv[2] || process.argv[3]) {
  console.log(
    `Please provide a single argument for the pdf you are searching for!
    Wrap your ebook title with double quotation marks if you need to!`
  );
  process.exit();
} else {
  pdfName = process.argv[2];
}

(async function () {
  const scrapers = [scrapePdfDrive, scrapeZLibrary];

  try {
    let allResources = [];
    let count = 0;
    scrapers.forEach(async function (scraper) {
      const resource = await scraper(
        pdfName,
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36"
      );
      allResources.push(resource);
      console.log("Done");
      if (++count === scrapers.length) {
        inqConsole(allResources);
      }
    });
  } catch (error) {
    console.log(error);
    allResources = [];
  }
  /*
  try {
    allResources = await scrapers.map(async (scraper) => {
      try {
        resource = await scraper(
          pdfName,
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36"
        );
        return resource;
      } catch (error) {
        console.log(error);
        return "error";
      }
    });
  } catch (error) {
    console.log(error);
  }

  inqConsole(allResources);*/
})();
