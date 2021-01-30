const cheerio = require('cheerio');
const fetch = require('node-fetch');
const EbookResource = require('../classes/EbookResource');
const urlEncode = require('../utils/urlEncode');
const trimWhiteSpace = require('../utils/trimWhiteSpace');
const loadCheerio = require('../utils/loadCheerio');

const sourceWebsite = 'https://1lib.us';

function scrapeZLibrary(ebookName, headers, bookIndex) {
  return new Promise(async function (resolve, reject) {
    try {
      //Create search link
      ebookName = urlEncode(ebookName);
      const searchLink = `/s/${ebookName}`;
      //Do search for ebook title and extract items
      const searchResults = await loadCheerio(
        sourceWebsite + searchLink,
        headers,
      );

      const itemLink = searchResults("[itemprop='name'] a")
        .eq(bookIndex)
        .attr('href');
      const title = searchResults("[itemprop='name']").eq(bookIndex).text();
      const author = searchResults("[itemprop='author']").eq(bookIndex).text();
      const fileFormat = searchResults(
        '.bookProperty.property__file .property_value',
      )
        .eq(bookIndex)
        .text()
        .split(',')[0];

      //Go to item page and get download link
      const itemPage = await loadCheerio(sourceWebsite + itemLink, headers);
      const downloadLink = itemPage('.addDownloadedBook').attr('href');

      //Create Resource
      const ebookInfo = {
        link:
          downloadLink[0] === '/' ? sourceWebsite + downloadLink : downloadLink,
        fileFormat,
        source: 'zlibrary',
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
    } catch (error) {
      console.log('ERROR CATCHER: ' + error);
      reject(error);
    }
  });
}

module.exports = scrapeZLibrary;
