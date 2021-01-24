//const puppeteer = require("puppeteer");
const Resource = require("../objects/Resource");
const urlEncode = require("../helperFuncs/urlEncode");
const puppeteer = require("puppeteer");

// add stealth plugin and use defaults (all evasion techniques)


const sourceWebsite = "https://1lib.us";

const scrapeZLibrary = async function (ebookName, numOfResults, userAgent) {
  ebookName = urlEncode(ebookName);
  const searchLink = `/s/${ebookName}`;

  console.log("Starting...");
  const browser = await puppeteer.launch(); //{devtools: true}
  const page = await browser.newPage();
  await page.setUserAgent(userAgent);

  let pdfResources = [];
  const maxNumOfResults = 5;
  for (i = 0; i < numOfResults && i < maxNumOfResults; i++) {
    //Do search for ebook title and extract items
    console.log("\nConnecting to website...");
    await page.goto(sourceWebsite + searchLink);
    console.log(sourceWebsite + searchLink);

    console.log(`Connected. Searching for requested item...`);
    await page.waitForSelector("#searchResultBox");

    let itemLink = null;
    let title = null;
    let author = null;
    let fileFormat = null;

    try {
      await page.evaluate(
        `document.querySelector("#searchResultBox").querySelectorAll(".resItemBox.resItemBoxBooks.exactMatch")[${i}]`
      );
      itemLink = await page.evaluate(
        `document.querySelector("#searchResultBox").querySelectorAll(".resItemBox.resItemBoxBooks.exactMatch")[${i}].querySelector("[itemprop='name'] a").getAttribute("href")`
      );
      title = await page.evaluate(
        `document.querySelector("#searchResultBox").querySelectorAll(".resItemBox.resItemBoxBooks.exactMatch")[${i}].querySelector("[itemprop='name']").innerText`
      );
      author = await page.evaluate(
        `document.querySelector("#searchResultBox").querySelectorAll(".resItemBox.resItemBoxBooks.exactMatch")[${i}].querySelector("[itemprop='author']").innerText`
      );
      fileFormat = await page.evaluate(
        `document.querySelector("#searchResultBox").querySelectorAll(".resItemBox.resItemBoxBooks.exactMatch")[${i}].querySelector(".bookProperty.property__file .property_value").innerText.split(',')[0]`
      );
    } catch {
      break;
    }

    //Get download link
    console.log("Item found. Extracting download link...");
    console.log(sourceWebsite + itemLink);

    await page.goto(sourceWebsite + itemLink, { waitUntil: "networkidle2" });
    //    await page.waitForSelector(".btn.btn-primary.dlButton.addDownloadedBook");

    //------------PROBLEM-------------- downlaodLink is loading differently in browser
    const downloadLink = await page.evaluate(`document.querySelector('.addDownloadedBook').href`);

    console.log("Download Link: " + downloadLink);

    const pdfResource = new Resource(
      downloadLink,
      fileFormat,
      "Zlibrary",
      { title, author }
    );

    console.log(downloadLink);
    pdfResources.push(pdfResource);
  }

  //Close browser and return download link
  await browser.close();
  console.log("Done.");

  return pdfResources;
};

module.exports = scrapeZLibrary;
