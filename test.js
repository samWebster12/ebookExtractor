const puppeteer = require("puppeteer");
const proxyGenerator = require("./helperFuncs/proxyGenerator");
const getProxy = require("get-free-https-proxy");
const scrapePdfDrive = require("./scrapers/pdfdrive");

//testing Proxy generator ---STATUS: not working

(async function () {
  const [proxy1] = await getProxy();
  console.log("Proxy: " + `--proxy-server=${proxy1.host}:${proxy1.port}`);
  const browser = await puppeteer.launch({
    headless: false,
    args: [`--proxy-server=${proxy1.host}:${proxy1.port}`],
  });

  const page = await browser.newPage();
  await page.goto("https://whatismyipaddress.com/");
  const ip = await page.evaluate(`document.querySelector('#ipv4').innerText`);

  console.log("Ip address: " + ip);
  browser.close();
})();
//testing downloading pdf in puppeteer ---STATUS: not working

(async () => {
  const browser = await puppeteer.launch();
  browser.on("targetcreated", async (target) => {
    let s = target.url();
    //the test opens an about:blank to start - ignore this
    if (s == "about:blank") {
      return;
    }
    //unencode the characters after removing the content type
    s = s.replace("data:text/csv;charset=utf-8,", "");
    //clean up string by unencoding the %xx
    fs.writeFile("/ebookDownload.csv", s, function (err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("The file was saved!");
    });
  });
  const pdfDriveResources = await scrapePdfDrive(
    "percy",
    2,
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36"
  );

  const page = await browser.newPage();
  console.log("Link: " + pdfDriveResources[0].link);
  await page.goto(pdfDriveResources[0].link);
})();
