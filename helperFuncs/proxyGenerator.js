const puppeteer = require('puppeteer');

const proxyWebsite = 'https://sslproxies.org/';

const proxyGenerator = async () => {
    //Launch puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //Generate random number for random ip address
    const maxRowNumber = 9;
    const minRowNumber = 0;

    const randomNumber = Math.floor(Math.random() * (maxRowNumber - minRowNumber + 1)) + minRowNumber;

    //Go to ip address website and extract ip based random number
    await page.goto(proxyWebsite);
    const ipAddress = await page.evaluate(`document.querySelectorAll('.even')[${randomNumber}].querySelector('td').innerText`);
    const port = await page.evaluate(`document.querySelectorAll('.even')[${randomNumber}].querySelectorAll('td')[1].innerText`);

    let proxy = `${ipAddress}:${port}`;

    browser.close();
    return proxy;
}

module.exports = proxyGenerator;

