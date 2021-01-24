const puppeteer = require("puppeteer");
const Resource = require("../objects/Resource");
const urlEncode = require("../helperFuncs/urlEncode");
const proxyGenerator = require('../helperFuncs/proxyGenerator');

const sourceWebsite = "https://pdfdrive.com";

const scrapePdfDrive = async function (ebookName, numOfResults, userAgent) {
  //Create search link
  ebookName = urlEncode(ebookName);
  const searchLink = `/search?q=${ebookName}&pagecount=&pubyear=&searchin=&em=`;
 
  //Launch Puppeteer 
  console.log("Starting...");
   const browser = await puppeteer.launch(); //{args: [`--proxy-server=${proxyGenerator()}`]}
  const page = await browser.newPage();
  await page.setUserAgent(userAgent);

  let pdfResources = [];
  const maxNumOfResults = 5;
  for (i = 0; i < numOfResults && i < maxNumOfResults; i++) {
    //Do search for pdf title and extract items
    console.log("Connecting to website...");
    await page.goto(sourceWebsite + searchLink);
    await page.waitForSelector(".files-new ul li");

   // let itemLink = ''
   // try {
      let itemLink = await page.evaluate(
        `document.querySelectorAll(".files-new ul li:not(.liad)")[${i}].querySelector("a").getAttribute("href")`
      );
  //  } catch {
   //   break;
  //  }
    

    //Go to the first item's link and redirect to download screen
    console.log(`Connected. Searching for requested item...`);
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
    const info = await page.evaluate(
      'document.querySelector(".ebook-file-info").innerText'
    );

    //Go to download page link and extract pdf file url
    console.log("Item found. Extracting download link...");
    await page.goto(sourceWebsite + downloadPageLink);
    await page.waitForSelector(".btn.btn-primary.btn-user");

    const pdfFileLink = await page.evaluate(
      'document.querySelector(".btn.btn-primary.btn-user").getAttribute("href")'
    );

    const pdfResource = new Resource(
      sourceWebsite + pdfFileLink,
      "PDF",
      "pdfdrive",
      { title, author, extraInfo: info }
    );

    pdfResources.push(pdfResource);
    console.log("file link: " + pdfFileLink + "\n");
  }

  //Close browser and return download link
  await browser.close();
  console.log("Done.");

  return pdfResources;
};

module.exports = scrapePdfDrive;
