const cheerio = require('cheerio');
const fetch = require('node-fetch');

async function loadCheerio(url, headers) {
  const response = await fetch(url, {
    headers,
  });
  const html = await response.text();
  const cheerioLoad = cheerio.load(html);

  return cheerioLoad;
}

module.exports = loadCheerio;
