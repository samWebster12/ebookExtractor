const urlEncode = (url) => {
  return url.replace(/\+/g, "%2B").replace(/\s/g, "%20");
};

module.exports = urlEncode;
