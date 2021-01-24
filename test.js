const puppeteer = require('puppeteer');
const proxyGenerator = require('./helperFuncs/proxyGenerator');

(async function () {
    const proxy = await proxyGenerator();
   // const proxy = 'http://103.123.229.107:8080';
    console.log('Proxy: ' + proxy);
    const browser = await puppeteer.launch({
        headless: false, 
        args: [`--proxy-server=${proxy}`]
    });

    console.log('here1');
    const page = await browser.newPage();
    console.log('here2');
    await page.goto('https://google.com/');
   // const ip = await page.evaluate(`document.querySelector('#ipv4').innerText`);

//    console.log('Ip address: ' + ip);
    browser.close();
    
})();





