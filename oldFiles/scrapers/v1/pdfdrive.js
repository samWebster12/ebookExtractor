const puppeteer = require('puppeteer');
const Resource = require('../objects/Resource');
const urlEncode = require('../helperFuncs/urlEncode');
const proxyGenerator = require('../helperFuncs/proxyGenerator');

const sourceWebsite = 'https://pdfdrive.com';

const scrapePdfDrive = async function (ebookName, numOfResults, userAgent) {
  //Create search link
  ebookName = urlEncode(ebookName);
  const searchLink = `/search?q=${ebookName}&pagecount=&pubyear=&searchin=&em=`;

  //Launch and set up Puppeteer
  console.log('PdfDrive Scraper Starting...');
  const browser = await puppeteer.launch(); //{args: [`--proxy-server=${proxyGenerator()}`]}
  const page = await browser.newPage();
  await page.setUserAgent(userAgent);
  page.setDefaultNavigationTimeout(10000);

  let pdfResources = [];
  const maxNumOfResults = 5;
  for (i = 0; i < numOfResults && i < maxNumOfResults; i++) {
    //Try and catch any errors that occur per iteration
    try {
      //Do search for pdf title and extract items
      console.log('Searching for requested item...');
      await page.goto(sourceWebsite + searchLink);

      await page.waitForSelector('.files-new ul li');

      let itemLink = await page.evaluate(
        `document.querySelectorAll(".files-new ul li:not(.liad)")[${i}].querySelector("a").getAttribute("href")`,
      );

      //Go to the first item's link and redirect to download screen
      console.log(`Opened item page. Opening download page..`);
      await page.goto(sourceWebsite + itemLink);
      await page.waitForSelector('#download-button-link');

      const downloadPageLink = await page.evaluate(
        'document.querySelector("#download-button-link").getAttribute("href")',
      );
      const title = await page.evaluate(
        'document.querySelector(".ebook-title").innerText',
      );
      const author = await page.evaluate(
        'document.querySelector(".ebook-author").innerText',
      );
      const info = await page.evaluate(
        'document.querySelector(".ebook-file-info").innerText',
      );

      //Go to download page link and extract pdf file url
      console.log('Opened download page. Extracting download link...');
      await page.goto(sourceWebsite + downloadPageLink, { timeout: 5000 });

      //Pdf drive has two different possible selectors for the download link so a try and catch
      //is used to differentiate them.
      try {
        //Look for download button link
        await page.waitForSelector('.btn.btn-primary.btn-user', {
          timeout: 100,
        });
        const downloadLink = await page.evaluate(
          'document.querySelector(".btn.btn-primary.btn-user").getAttribute("href")',
        );

        //Create new resouce with all info
        const pdfResource = new Resource(
          downloadLink[0] === '/' ? sourceWebsite + downloadLink : downloadLink,
          'PDF OR EPUB',
          'pdfdrive',
          { title, author, extraInfo: info },
        );

        //Add Resource to array of Resources that will later be returned
        pdfResources.push(pdfResource);
        console.log('SUCCESS\n');
      } catch {
        //Look for download button link
        await page.waitForSelector('.btn.btn-success.btn-responsive', {
          timeout: 100,
        });
        const downloadLink = await page.evaluate(
          'document.querySelector(".btn.btn-success.btn-responsive").getAttribute("href")',
        );

        //Create new resouce with all info
        const pdfResource = new Resource(
          downloadLink[0] === '/' ? sourceWebsite + downloadLink : downloadLink,
          'PDF',
          'pdfdrive',
          { title, author, extraInfo: info },
        );

        //Add Resource to array of Resources that will later be returned
        pdfResources.push(pdfResource);
        console.log('SUCCESS\n');
      }
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
  return pdfResources;
};

module.exports = scrapePdfDrive;
