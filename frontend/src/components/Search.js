import React from 'react';
import verifyToken from '../utils/verifyToken';
import '../css/base.css';
import '../css/search.css';
import logo from '../images/logo2.png';
import nocover from '../images/nocover.jpg';
import SearchResult from './SearchResult';

class Search extends React.Component {
  constructor() {
    super();
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {
      userData: {},
      currentResultKey: 0,
      results: [],
    };
  }

  async componentDidMount() {
    (async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const tokenData = await verifyToken(token);
        if (!tokenData.passed) {
          this.props.history.push('/signin');
        } else {
          this.setState({ userData: tokenData.userData });
        }
      } else {
        this.props.history.push('/signin');
      }
    })();

    document.addEventListener('click', openCloseDropDown);
    document
      .querySelector('.search__bar-wrapper')
      .addEventListener('submit', controlResultsBorder);
  }
  componentWillUnmount() {
    document.removeEventListener('click', openCloseDropDown);
  }

  handleSignOut() {
    localStorage.removeItem('token');
    this.props.setUsername('');

    this.props.history.push('/signin');
  }

  async handleSearch() {
    document.querySelector('#results').innerHTML = '';

    //GET DATA FROM SEARCH BAR
    const search = document.querySelector('#search').value;
    const formData = {
      search,
    };

    try {
      //SEND REQUEST TO SERVER TO GET EBOOKS
      console.log('trying fetch');
      const response = await fetch('http://localhost:8080/api/ebooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log('fetch succedded');

      const reader = response.body.getReader();
      //Check for incoming chunks
      while (true) {
        //Check whether stream is "done" or a "value" has been sent
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        const resource = processChunk(value);

        //Change HTML and insert new info

        //Split incoming traffic because two books might have come as one
        const resources = resource.split('<-->');
        //Cut of end if there is no there book there
        if (resources[resources.length - 1] === '') resources.pop();
        resources.forEach((resource) => {
          //split data and store it
          const resourceDataArr = resource.split('---');
          const resourceData = {
            link: resourceDataArr[0],
            fileFormat: resourceDataArr[1],
            source: resourceDataArr[2],
            title: resourceDataArr[3],
            author: resourceDataArr[4],
            pageCount: resourceDataArr[5],
            key: this.state.currentResultKey,
          };

          if (resourceData.pageCount === '-1') {
            resourceData.pageCount = 'UNKNOWN';
          }

          if (resourceData.title.length > 50) {
            resourceData.title = resourceData.title.slice(0, 49) + '...';
          }

          //create result item from functin (down below)
          /* const resultItem = createResultItem(
            resourceData,
            this.state.currentResultKey,
          );*/

          //Set the state of the key so the key is always different
          this.setState((prevState) => {
            return {
              userData: prevState.userData,
              currentResultKey: prevState.currentResultKey + 1,
              results: [...prevState.results, resourceData],
            };
          });
          // document.querySelector('#results').appendChild(resultItem);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  /**/
  render() {
    return (
      <div className="body">
        <div className="username">
          <div className="username__name">
            {this.state.userData.username /*'a;sdjf;lkfsaSammyBoy12'*/}
          </div>
          <i className="fas fa-caret-down username__dd-arrow"></i>
        </div>

        <div className="drop-down">
          <div className="drop-down__item">
            <a className="drop-down__item__link" onClick={this.handleSignOut}>
              Sign Out
            </a>
          </div>
          <div className="drop-down__item">
            <a className="drop-down__item__link">Profile</a>
          </div>
          <div className="drop-down__item">
            <a className="drop-down__item__link">History</a>
          </div>
          <div className="drop-down__item">
            <a className="drop-down__item__link">Friends</a>
          </div>
        </div>

        <main className="body__main">
          <section className="search">
            <div className="search__logo">
              {/*  <img src={logo} className="search__logo__image" />*/}

              <p>Ebookz Today</p>
            </div>

            <form className="search__bar-wrapper" onSubmit={this.handleSearch}>
              <input
                type="text"
                className="search__bar-wrapper__bar"
                placeholder="Search An Ebook Title"
                id="search"
              />
              <input
                type="submit"
                className="search__bar-wrapper__submit-btn"
                value=""
              />
              <i className="fas fa-search search__bar-wrapper__submit-btn__icon"></i>
            </form>
          </section>
          <section className="results" id="results">
            {console.log(this.state.results)}
            {this.state.results.map((result) => {
              return (
                <SearchResult
                  title={result.title}
                  author={result.author}
                  source={result.source}
                  fileFormat={result.fileFormat}
                  link={result.link}
                  pageCount={result.pageCount}
                  key={result.key}
                />
              );
            })}
          </section>
        </main>
      </div>
    );
  }
}

export default Search;

function openCloseDropDown(e) {
  const dropDownArrow = document.querySelector('.username');
  const dropDownMenu = document.querySelector('.drop-down');

  if (
    e.target.classList.contains('username') ||
    e.target.classList.contains('username__name') ||
    e.target.classList.contains('username__dd-arrow')
  ) {
    if (dropDownArrow.classList.contains('open')) {
      dropDownArrow.classList.remove('open');
      dropDownMenu.style.display = 'none';
    } else {
      dropDownMenu.style.display = 'flex';
      dropDownArrow.classList.add('open');
    }
  } else {
    if (dropDownArrow.classList.contains('open')) {
      dropDownArrow.classList.remove('open');
      dropDownMenu.style.display = 'none';
    }
  }
}

//MAKE SURE NO BORDER IF NO RESULTS
function controlResultsBorder(e) {
  e.preventDefault();
  document.querySelector('.results').classList.add('are-results');
}

//PROCESS CHUNK FOR WHEN SEARCH TAKES PLACE
function processChunk(chunk) {
  let result = new TextDecoder('utf-8').decode(chunk);
  return result;
}

function createResultItem(
  { title, author, fileFormat, pageCount, link, source },
  key,
) {
  //CREATE NEW RESULT ELEMENT
  const newResult = document.createElement('DIV');
  newResult.setAttribute('class', 'results__item');
  newResult.setAttribute('key', key);

  //INSERT HTML
  newResult.innerHTML = `
  <img src=${nocover} class="results__item__cover" />
  <div class="results__item__main-section">
    <div class="results__item__main-section__heading">
      <p class="results__item__main-section__heading__title">
        ${title}
      </p>
      <p class="results__item__main-section__heading__author">
        ${author}
      </p>
    </div>
    <div class="results__item__main-section__info">
      <div class="results__item__main-section__info__filetype">
        <p>
          File:
          <span class="results__item__main-section__info__data">
            ${fileFormat}
          </span>
        </p>
      </div>
      <div class="results__item__main-section__info__source">
        <p>
          Source:
          <span class="results__item__main-section__info__data">
            ${source}
          </span>
        </p>
      </div>
      <div class="results__item__main-section__info__page-count">
        Pages:
        <span class="results__item__main-section__info__data">
          ${pageCount}
        </span>
      </div>
    </div>
    <div class="results__item__main-section__download">
        <a href=${link} class="results__item__main-section__download__btn btn">Download</a>
    </div>
  </div>

  `;

  return newResult;
}

/*<button class="results__item__main-section__download__btn btn">
        <a href=${link} class="results__item__main-section__download__link">Download</a>
      </button>*/
