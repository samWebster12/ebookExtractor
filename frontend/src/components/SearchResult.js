import React from 'react';
import nocover from '../images/nocover.jpg';

function SearchResult({
  title,
  author,
  fileFormat,
  pageCount,
  link,
  source,
  key,
}) {
  return (
    <div className="results__item" key={key}>
      <img src={nocover} className="results__item__cover" />
      <div className="results__item__main-section">
        <div className="results__item__main-section__heading">
          <p className="results__item__main-section__heading__title">{title}</p>
          <p className="results__item__main-section__heading__author">
            {author}
          </p>
        </div>
        <div className="results__item__main-section__info">
          <div className="results__item__main-section__info__filetype">
            <p>
              File:
              <span className="results__item__main-section__info__data">
                {' ' + fileFormat}
              </span>
            </p>
          </div>
          <div className="results__item__main-section__info__source">
            <p>
              Source:
              <span className="results__item__main-section__info__data">
                {' ' + source}
              </span>
            </p>
          </div>
          <div className="results__item__main-section__info__page-count">
            Pages:
            <span className="results__item__main-section__info__data">
              {' ' + pageCount}
            </span>
          </div>
        </div>
        <div className="results__item__main-section__download">
          <a
            href={link}
            className="results__item__main-section__download__btn btn"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

export default SearchResult;
