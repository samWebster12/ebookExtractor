const cheerio = require('cheerio');
const fetch = require('node-fetch');

async function loadCheerio(url, someHeaders) {
  const response = await fetch(url, {
    method: 'GET',
    headers: someHeaders,
  });
  const html = await response.text();
  const cheerioLoad = cheerio.load(html);

  return cheerioLoad;
}

module.exports = loadCheerio;
