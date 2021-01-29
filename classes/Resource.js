const open = require('open');

class Resource {
  constructor({ link, fileFormat, source }) {
    this.link = link;
    this.fileFormat = fileFormat;
    this.source = source;
  }

  download = function () {
    open(this.link);
  };
}

module.exports = Resource;
