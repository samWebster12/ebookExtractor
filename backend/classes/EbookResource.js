const Resource = require('./Resource');

//set to undefined if unknown.
class EbookResource extends Resource {
  constructor({ link, fileFormat, source, title, author, pageCount, imgLink }) {
    super({ link, fileFormat, source });
    this.title = title;
    this.author = author;
    this.pageCount = pageCount;
    this.imgLink = imgLink;
  }
}

module.exports = EbookResource;
