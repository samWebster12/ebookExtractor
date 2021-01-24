const open = require("open");

class Resource {
  constructor(link, fileFormat, source, info) {
    this.link = link;
    this.fileFormat = fileFormat;
    this.source = source;
    this.info = info;
  }

  download = function () {
    open(this.link);
  };
}

module.exports = Resource;
