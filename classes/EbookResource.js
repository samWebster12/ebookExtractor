const Resource = require('./Resource');

//set to undefined if unknown.
class EbookResource extends Resource {
  constructor({ link, fileFormat, source, title, author, pageCount }) {
    super({ link, fileFormat, source });
    this.title = title;
    this.author = author;
    this.pageCount = pageCount;
  }
}

module.exports = EbookResource;
