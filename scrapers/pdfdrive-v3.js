const puppeteer = require('puppeteer');
const EbookResource = require('../classes/EbookResource');
const urlEncode = require('../utils/urlEncode');
const trimWhiteSpace = require('../utils/trimWhiteSpace');
const loadCheerio = require('../utils/loadCheerio');

const sourceWebsite = 'https://pdfdrive.com';

function scrapePdfDrive(ebookName, headers, bookIndex) {
  return new Promise(async function (resolve, reject) {
    try {
      //Create search link
      ebookName = urlEncode(ebookName);
      const searchLink = `/search?q=${ebookName}&pagecount=&pubyear=&searchin=&em=`;

      //Do search for ebook title and extract item link
      const searchResults = await loadCheerio(
        sourceWebsite + searchLink,
        headers,
      );

      const itemLink = searchResults('.files-new ul li:not(.liad)')
        .eq(bookIndex)
        .find('a')
        .attr('href');

      //Go to item page and get book info
      const itemPage = await loadCheerio(sourceWebsite + itemLink, headers);
      const dlInterfaceLink = itemPage('#download-button-link').attr('href');
      const title = itemPage('.ebook-title').text();
      const author = itemPage('.ebook-author').text();

      //Go to download interface (Must use uppeteer here to execute javascript)
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setExtraHTTPHeaders(headers);
      page.setDefaultNavigationTimeout(10000);

      await page.goto(sourceWebsite + dlInterfaceLink);

      let downloadLink = '';
      downloadLink = await getDownloadLink(
        ['.btn.btn-primary.btn-user', '.btn.btn-success.btn-responsive'],
        page,
      );

      browser.close();

      //Create Resource
      const ebookInfo = {
        link:
          downloadLink[0] === '/' ? sourceWebsite + downloadLink : downloadLink,
        fileFormat: 'PDF',
        source: 'pdfdrive',
        title,
        author,
        pageCount: -1,
      };

      //Process strings and trim any unnecessary white space
      Object.keys(ebookInfo).forEach((key) => {
        if (typeof ebookInfo[key] === 'string') {
          ebookInfo[key] = trimWhiteSpace(ebookInfo[key]);
        }
      });

      //Return EbookResource with info
      resolve(new EbookResource(ebookInfo));

      //
      //
    } catch (error) {
      console.log('ERROR CATCHER: ' + error);
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
          `document.querySelector("${selector}").getAttribute("href")`,
        );

        resolve(downloadLink);
      } catch {
        if (++count >= selectors.length) {
          reject(new Error('error'));
        }
      }
    });
  });
}

/*
function getDownloadLink(selectors, pageObj) {
  let count = 0;
  selectors.forEach(async function (selector) {
    try {
      const downloadLink = pageObj.window.document
        .querySelector(selector)
        .getAttribute('href');

      return downloadLink;
    } catch {
      if (++count >= selectors.length) {
        return new Error('failed to find download link');
      }
    }
  });
}*/

module.exports = scrapePdfDrive;
