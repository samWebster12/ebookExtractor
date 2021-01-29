const puppeteer = require('puppeteer');
const Resource = require('../objects/Resource');
const urlEncode = require('../helperFuncs/urlEncode');

const sourceWebsite = 'https://1lib.us';

const scrapeZLibrary = async function (ebookName, numOfResults, userAgent) {
  ebookName = urlEncode(ebookName);
  const searchLink = `/s/${ebookName}`;

  console.log('ZLibrary Scraper Starting...');
  const browser = await puppeteer.launch(); //{devtools: true}
  const page = await browser.newPage();
  await page.setUserAgent(userAgent);
  page.setDefaultNavigationTimeout(10000);

  let pdfResources = [];
  const maxNumOfResults = 5;
  for (i = 0; i < numOfResults && i < maxNumOfResults; i++) {
    //Try and catch any error that occur per iteration
    try {
      //Do search for ebook title and extract items
      console.log('Connecting to website...');
      await page.goto(sourceWebsite + searchLink);

      console.log(`Connected. Searching for requested item...`);
      await page.waitForSelector('#searchResultBox');

      let itemLink = null;
      let title = null;
      let author = null;
      let fileFormat = null;
      itemLink = await page.evaluate(
        `document.querySelector("#searchResultBox").querySelectorAll(".resItemBox.resItemBoxBooks.exactMatch")[${i}].querySelector("[itemprop='name'] a").getAttribute("href")`,
      );
      title = await page.evaluate(
        `document.querySelector("#searchResultBox").querySelectorAll(".resItemBox.resItemBoxBooks.exactMatch")[${i}].querySelector("[itemprop='name']").innerText`,
      );
      author = await page.evaluate(
        `document.querySelector("#searchResultBox").querySelectorAll(".resItemBox.resItemBoxBooks.exactMatch")[${i}].querySelector("[itemprop='author']").innerText`,
      );
      fileFormat = await page.evaluate(
        `document.querySelector("#searchResultBox").querySelectorAll(".resItemBox.resItemBoxBooks.exactMatch")[${i}].querySelector(".bookProperty.property__file .property_value").innerText.split(',')[0]`,
      );

      //Get download link
      console.log('Item found. Extracting download link...');

      await page.goto(sourceWebsite + itemLink, { waitUntil: 'networkidle2' });
      const downloadLink = await page.evaluate(
        `document.querySelector('.addDownloadedBook').href`,
      );

      const pdfResource = new Resource(
        downloadLink[0] === '/' ? sourceWebsite + downloadLink : downloadLink,
        fileFormat,
        'Zlibrary',
        { title, author },
      );

      pdfResources.push(pdfResource);
      console.log('SUCCESS\n');
    } catch (e) {
      console.log(
        'FAILED. Something went wrong in iteration ' +
          i +
          '\nError: ' +
          e +
          '\n',
      );
      continue;
    }
  }
  //Close browser and return download link
  await browser.close();
  console.log('Done.');

  return pdfResources;
};

module.exports = scrapeZLibrary;
