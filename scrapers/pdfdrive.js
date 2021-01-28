const puppeteer = require("puppeteer");
const EbookResource = require("../classes/EbookResource");
const urlEncode = require("../utils/urlEncode");

const sourceWebsite = "https://pdfdrive.com";

async function scrapePdfDrive(ebookName, userAgent) {
  return new Promise(async function (resolve, reject) {
    try {
      //Create search link
      ebookName = urlEncode(ebookName);
      const searchLink = `/search?q=${ebookName}&pagecount=&pubyear=&searchin=&em=`;

      //Launch and set up Puppeteer
      const browser = await puppeteer.launch(); //{args: [`--proxy-server=${proxyGenerator()}`]}
      const page = await browser.newPage();
      await page.setUserAgent(userAgent);
      page.setDefaultNavigationTimeout(10000);

      //Do search for pdf title and extract items
      await page.goto(sourceWebsite + searchLink);
      await page.waitForSelector(".files-new ul li");

      let itemLink = await page.evaluate(
        `document.querySelectorAll(".files-new ul li:not(.liad)")[${0}].querySelector("a").getAttribute("href")`
      );

      //Go to Item page and get book info
      await page.goto(sourceWebsite + itemLink);
      await page.waitForSelector("#download-button-link");

      const downloadPageLink = await page.evaluate(
        'document.querySelector("#download-button-link").getAttribute("href")'
      );
      const title = await page.evaluate(
        'document.querySelector(".ebook-title").innerText'
      );
      const author = await page.evaluate(
        'document.querySelector(".ebook-author").innerText'
      );

      //Go to download page link and extract pdf file url
      await page.goto(sourceWebsite + downloadPageLink, { timeout: 5000 });

      let downloadLink = "";
      downloadLink = await getDownloadLink(
        [".btn.btn-primary.btn-user", ".btn.btn-success.btn-responsive"],
        page
      );

      //Create and return resource
      const ebookInfo = {
        link: downloadLink,
        fileFormat: "PDF",
        source: "pdfdrive",
        title,
        author,
        pageCount: -1,
      };

      resolve(new EbookResource(ebookInfo));
    } catch (error) {
      console.log("ERORR CATCHER: " + error);
      reject(error);
    }
  });
}

//---------------------------------------------------------------------------------------------------------------------------------
//UTILITY FUNCTIONS

function getDownloadLink(selectors, pageObj) {
  return new Promise((resolve, reject) => {
    let count = 0;
    selectors.forEach(async function (selector) {
      try {
        await pageObj.waitForSelector(selector, { timeout: 1000 });
        const downloadLink = await pageObj.evaluate(
          `document.querySelector("${selector}").getAttribute("href")`
        );

        resolve(downloadLink);
      } catch {
        if (++count >= selectors.length) {
          reject(new Error("error"));
        }
      }
    });
  });
}

/*COMMENTS
console.log("PdfDrive Scraper Starting...");
console.log("Searching for requested item...");
console.log(`Opened item page. Opening download page..`);
console.log("Opened download page. Extracting download link...");
*/

module.exports = scrapePdfDrive;
