const cheerio = require('cheerio');
const fetch = require('node-fetch');
const HttpsProxyAgent = require('http-proxy-agent');
const getProxies = require('get-free-https-proxy');

async function loadCheerio(url, someHeaders) {
  try {
    //  const [proxy] = await getProxies();
    //  console.log(`${proxy.host}:${proxy.port}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: someHeaders,
      // agent: new HttpsProxyAgent(`https://193.239.86.248:3128`),
    });

    const html = await response.text();
    // console.log(html);
    const cheerioLoad = cheerio.load(html);

    return cheerioLoad;
  } catch (error) {
    console.log('URL: ' + url);
    throw error;
    //  throw new Error('NETWORK: unable to reach url');
  }
}

module.exports = loadCheerio;
