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
      let searchLink = `/s/${ebookName}`;
      searchLink = encodeURI(searchLink);
      //Do search for ebook title and extract items
      let searchResults;
      try {
        searchResults = await loadCheerio(sourceWebsite + searchLink, headers);
      } catch (error) {
        throw error;
      }

      let itemLink = searchResults("[itemprop='name'] a")
        .eq(bookIndex)
        .attr('href');

      itemLink = encodeURI(itemLink);
      const title = searchResults("[itemprop='name']").eq(bookIndex).text();
      const author = searchResults("[itemprop='author']").eq(bookIndex).text();
      const fileFormat = searchResults(
        '.bookProperty.property__file .property_value',
      )
        .eq(bookIndex)
        .text()
        .split(',')[0];

      //Go to item page and get download link
      let itemPage;
      try {
        itemPage = await loadCheerio(sourceWebsite + itemLink, headers);
      } catch (error) {
        throw error;
      }
      let downloadLink = itemPage('.addDownloadedBook').attr('href');
      downloadLink = encodeURI(downloadLink);

      let imgLink;
      try {
        imgLink = itemPage('img').attr('src');
      } catch (error) {
        console.log(error);
        imgLink =
          'https://s.pdfdrive.com/assets/thumbs/e30/e30a6d77efd232e46c5c99acc15bdd50.jpg';
      }

      let pageCount;
      try {
        pageCount = itemPage('.property_pages .property_value').text();
        if (pageCount === '') {
          pageCount = -1;
        }
      } catch (error) {
        console.log(error);
        pageCount = -1;
      }

      //Create Resource
      const ebookInfo = {
        link:
          downloadLink[0] === '/' ? sourceWebsite + downloadLink : downloadLink,
        fileFormat,
        source: 'zlibrary',
        title,
        author,
        imgLink,
        pageCount,
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

module.exports = scrapeZLibrary;
