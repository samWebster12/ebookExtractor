/*const express = require("express");
const open = require("open");
const puppeteer = require("puppeteer");

const PDF_NAME = "tcp+ip";
const sourceWebsite = "https://pdfdrive.com";
const searchLink = `/search?q=${PDF_NAME}&pagecount=&pubyear=&searchin=&em=`;

const app = express();

const downloadPdf = async function () {
  console.log("Starting...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  //Do search for pdf title and extract first item
  console.log("Connecting to website...");
  await page.goto(sourceWebsite + searchLink);
  await page.waitForSelector(".files-new ul li");

  const firstItemLink = await page.evaluate(
    'document.querySelector(".files-new ul li a").getAttribute("href")'
  );

  //Go to the first item's link and redirect to download screen
  console.log("Connected. Searching for requested item...");
  await page.goto(sourceWebsite + firstItemLink);
  await page.waitForSelector("#download-button-link");

  const downloadPageLink = await page.evaluate(
    'document.querySelector("#download-button-link").getAttribute("href")'
  );

  //Go to download page link and extract pdf file url
  console.log("Item found. Extracting download link...");
  await page.goto(sourceWebsite + downloadPageLink);
  await page.waitForSelector(".btn.btn-primary.btn-user");

  const pdfFileLink = await page.evaluate(
    'document.querySelector(".btn.btn-primary.btn-user").getAttribute("href")'
  );

  //Use "open" module to open pdf link in browser and download pdf file
  console.log("Finished extracting. Opening download link...");
  open(sourceWebsite + pdfFileLink);
  await browser.close();
  console.log("Done.");
};

app.get("/", (req, res) => {
  downloadPdf();

  res.end("<h1>Loading</h1>");
});*/
/*

app.get("/", (req, res) => {
  fetch(searchLink, { method: "GET" })
    .then((resultsPage) => resultsPage.text())
    .then((resultsPage) => {
      console.log(ebookLink);

      (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(sourceWebsite + ebookLink);
        await page.waitForSelector(".btn.btn-primary.btn-user");

        const downloadLink = await page.evaluate(
          'document.querySelector(".btn.btn-primary.btn-user").getAttribute("href")'
        );

        console.log(sourceWebsite + downloadLink);
        open(sourceWebsite + downloadLink);
        await browser.close();
      })();

      //   FileSaver.saveAs(sourceWebsite + downloadLink, "book.pdf");

      
        fetch(sourceWebsite + downloadLink, { method: "GET" })
          .then((res) => res.blob())
          .then((blob) => {})
          .catch((err) => console.log(err));

        await browser.close();

      res.end(resultsPage);
    })
    .catch((err) => console.log(err));
});*/
/*
app.listen(3000, () => {
  console.log("running on port af");
});

function replaceChar(origString, replaceChar, index) {
  let firstPart = origString.substr(0, index);
  let lastPart = origString.substr(index + 1);

  let newString = firstPart + replaceChar + lastPart;
  return newString;
}*/

/*
      fetch("https://pdfdrive.com" + link, { method: "GET" })
        .then((downloadPage) => downloadPage.text())
        .then((downloadPage) => {
          
          const downloadDom = new JSDOM(downloadPage);
          const thing = downloadDom.window.document.querySelector(
            ".btn.btn-primary.btn-user"
          );
          //console.log(thing);
          const pdfLink = downloadDom.window.document
            .querySelector(".btn.btn-primary.btn-user")
            .getAttribute("href");

          res.end(downloadPage);
        })
        .catch((err) => console.log(err));
        */
