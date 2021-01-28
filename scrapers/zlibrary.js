const puppeteer = require("puppeteer");
const EbookResource = require("../classes/EbookResource");
const urlEncode = require("../utils/urlEncode");

const sourceWebsite = "https://1lib.us";

async function scrapeZLibrary(ebookName, userAgent) {
  return new Promise(async function (resolve, reject) {
    try {
      //Create search link
      ebookName = urlEncode(ebookName);
      const searchLink = `/s/${ebookName}`;

      //---------------------------------------------------------------------------------------------------------------------------------
      //Launch and set up Puppeteer
      const browser = await puppeteer.launch(); //{devtools: true}
      const page = await browser.newPage();
      await page.setUserAgent(userAgent);
      page.setDefaultNavigationTimeout(10000);

      //---------------------------------------------------------------------------------------------------------------------------------
      //Do search for ebook title and extract items
      await page.goto(sourceWebsite + searchLink);
      await page.waitForSelector("#searchResultBox");

      let itemLink;
      let title;
      let author;
      let fileFormat;
      itemLink = await page.evaluate(
        `document.querySelector("#searchResultBox").querySelectorAll(".resItemBox.resItemBoxBooks.exactMatch")[0].querySelector("[itemprop='name'] a").getAttribute("href")`
      );
      title = await page.evaluate(
        `document.querySelector("#searchResultBox").querySelectorAll(".resItemBox.resItemBoxBooks.exactMatch")[0].querySelector("[itemprop='name']").innerText`
      );
      author = await page.evaluate(
        `document.querySelector("#searchResultBox").querySelectorAll(".resItemBox.resItemBoxBooks.exactMatch")[0].querySelector("[itemprop='author']").innerText`
      );
      fileFormat = await page.evaluate(
        `document.querySelector("#searchResultBox").querySelectorAll(".resItemBox.resItemBoxBooks.exactMatch")[0].querySelector(".bookProperty.property__file .property_value").innerText.split(',')[0]`
      );

      //---------------------------------------------------------------------------------------------------------------------------------
      //Get download link
      await page.goto(sourceWebsite + itemLink, { waitUntil: "networkidle2" });
      const downloadLink = await page.evaluate(
        `document.querySelector('.addDownloadedBook').href`
      );

      //---------------------------------------------------------------------------------------------------------------------------------
      //Create and return resource
      const ebookInfo = {
        link:
          downloadLink[0] === "/" ? sourceWebsite + downloadLink : downloadLink,
        fileFormat,
        source: "zlibrary",
        title,
        author,
        pageCount: -1,
      };

      resolve(new EbookResource(ebookInfo));
    } catch (error) {
      reject(error);
    }
  });
}

/*COMMENTS
console.log("ZLibrary Scraper Starting...");
console.log("Connecting to website...");
console.log(`Connected. Searching for requested item...`);
console.log("Item found. Extracting download link...");
*/

module.exports = scrapeZLibrary;
