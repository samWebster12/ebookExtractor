const EbookResource = require('../classes/EbookResource');
const trimWhiteSpace = require('../utils/trimWhiteSpace');
const loadCheerio = require('../utils/loadCheerio');

const sourceWebsite = 'http://libgen.li';

function scrapeLibgen(ebookName, headers, bookIndex) {
  return new Promise(async function (resolve, reject) {
    try {
      //Do search for ebook title and extract item link
      let searchLink = `/search.php?req=${ebookName}&lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=def`;
      searchLink = encodeURI(searchLink);

      let searchResults;
      try {
        searchResults = await loadCheerio(sourceWebsite + searchLink, headers);
      } catch (error) {
        throw error;
      }

      let itemLink = searchResults('.c')
        .find('tr')
        .eq(bookIndex + 1)
        .find('td')
        .eq(2)
        .find('a')
        .attr('href');

      itemLink = encodeURI(itemLink);

      //Go to item page and get book data
      let itemPage;
      try {
        itemPage = await loadCheerio(sourceWebsite + '/' + itemLink, headers);
      } catch (error) {
        throw error;
      }

      const title = itemPage('tbody tr').eq(1).find('td').eq(2).text();

      const author = itemPage('tbody tr').eq(2).find('td').eq(1).text();

      const fileFormat = itemPage('tbody tr')
        .eq(10)
        .find('td')
        .eq(3)
        .text()
        .toUpperCase();

      const imgLink =
        sourceWebsite + itemPage('tbody tr').eq(1).find('img').attr('src');

      const pageCount = itemPage('tbody tr')
        .eq(6)
        .find('td')
        .eq(3)
        .text()
        .split('\\')[0];

      const dlInterfaceLink = itemPage('tbody tr')
        .eq(21)
        .find('a')
        .attr('href');

      //Go to download interface link and get download link
      let dlInterface;
      try {
        dlInterface = await loadCheerio(
          sourceWebsite + dlInterfaceLink,
          headers,
        );
      } catch (error) {
        throw error;
      }

      let downloadLink = dlInterface('a').attr('href');
      downloadLink = encodeURI(downloadLink);

      //Create Resource
      const ebookInfo = {
        link:
          downloadLink[0] === '/' ? sourceWebsite + downloadLink : downloadLink,
        fileFormat,
        source: 'libgen',
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

module.exports = scrapeLibgen;
