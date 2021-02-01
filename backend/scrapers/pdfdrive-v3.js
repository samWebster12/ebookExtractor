const puppeteer = require('puppeteer');
const EbookResource = require('../classes/EbookResource');
const urlEncode = require('../utils/urlEncode');
const trimWhiteSpace = require('../utils/trimWhiteSpace');
const loadCheerio = require('../utils/loadCheerio');

const sourceWebsite = 'https://pdfdrive.com';

function scrapePdfDrive(ebookName, headers, bookIndex) {
  /* console.log('Ebook Name: ' + ebookName);
  console.log('Index: ' + bookIndex);
  console.log(headers);*/
  return new Promise(async function (resolve, reject) {
    try {
      //Create search link
      ebookName = urlEncode(ebookName);
      const searchLink = `/search?q=${ebookName}&pagecount=&pubyear=&searchin=&em=`;

      //Do search for ebook title and extract item link
      let searchResults;
      try {
        searchResults = await loadCheerio(sourceWebsite + searchLink, headers);
      } catch (error) {
        throw error;
      }

      const itemLink = searchResults('.files-new ul li:not(.liad)')
        .eq(bookIndex)
        .find('a')
        .attr('href');

      //Go to item page and get book info
      let itemPage;
      try {
        itemPage = await loadCheerio(sourceWebsite + itemLink, headers);
      } catch (error) {
        throw error;
      }
      const dlInterfaceLink = itemPage('#download-button-link').attr('href');
      const title = itemPage('.ebook-title').text();
      const author = itemPage('.ebook-author').text();

      //Go to download interface (Must use puppeteer here to execute javascript)
      let page;
      let browser;
      try {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.setExtraHTTPHeaders(headers);
        page.setDefaultNavigationTimeout(30000);
      } catch {
        throw new Error('PUPPETEER SETUP: unable to startup puppeteer');
      }

      try {
        await page.goto(sourceWebsite + dlInterfaceLink);
      } catch (error) {
        throw new Error('NETWORK: unable to reach url');
      }
      let downloadLink;
      try {
        downloadLink = await getDownloadLink(
          ['.btn.btn-primary.btn-user', '.btn.btn-success.btn-responsive'],
          page,
        );
      } catch (error) {
        throw new Error('DOWNLOAD LINK: unable to extract download link');
      }

      browser.close();

      //Create Resource
      const ebookInfo = {
        link:
          downloadLink[0] === '/' ? sourceWebsite + downloadLink : downloadLink,
        fileFormat: 'PDF',
        source: 'pdfdrive',
        title,
        author,
        pageCount: undefined,
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
      if (
        error.message.split(':') &&
        (error.message.split(':')[0] === 'NETWORK' ||
          error.message.split(':')[0] === 'DOWNLOAD LINK' ||
          error.message.split(':')[0] === 'PUPPETEER SETUP')
      ) {
        reject(error);
      } else {
        reject(error);
        //reject(new Error('MISC: something went wrong'));
      }
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
        await pageObj.waitForSelector(selector, { timeout: 10000 });
        const downloadLink = await pageObj.evaluate(
          `document.querySelector("${selector}").getAttribute("href")`,
        );

        resolve(downloadLink);
      } catch (error) {
        if (++count >= selectors.length) {
          //reject(new Error('error'));
          reject(error);
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