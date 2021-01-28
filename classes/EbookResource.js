const Resource = require("./Resource");

class EbookResource extends Resource {
  constructor({ link, fileFormat, source, title, author, pageCount }) {
    super({ link, fileFormat, source });
    this.title = title;
    this.author = author;
    this.pageCount = pageCount;
  }
}

module.exports = EbookResource;
