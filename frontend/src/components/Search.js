import React from 'react';
import getAuthData from '../utils/getAuthData';
//import '../css/base.css';
//import '../css/search.css';
import logo from '../images/logo2.png';
import SearchResult from './SearchResult';
import '../scss/base.scss';
import '../scss/search.scss';
import code from '../code';

class Search extends React.Component {
  constructor() {
    super();
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSeeMore = this.handleSeeMore.bind(this);
    this.state = {
      userData: {},
      currentResultKey: 0,
      results: [],
      searchKey: 0,
      prevSearch: '',
      currentBookIndex: 0,
      resultsReceived: 0,
      resultsExpected: 0,
    };
  }

  async componentDidMount() {
    (async () => {
      const token = localStorage.getItem('token');
      if (token) {
        let tokenData;
        try {
          tokenData = await getAuthData(token);
          if (tokenData.passed !== true) {
            this.props.history.push('/signin');
          } else {
            this.setState({ userData: tokenData.userData });
          }
        } catch (error) {
          console.log(error);
          this.props.history.push('/signin');
        }
      } else {
        this.props.history.push('/signin');
      }
    })();

    document.addEventListener('click', openCloseDropDown);
    /*  document
      .querySelector('.search__bar-wrapper')
      .addEventListener('submit', controlResultsBorder);*/
  }
  componentWillUnmount() {
    document.removeEventListener('click', openCloseDropDown);
  }

  handleSignOut() {
    localStorage.removeItem('token');
    this.props.setUsername('');

    this.props.history.push('/signin');
  }

  async handleSeeMore() {
    //GET DATA FROM SEARCH BAR
    console.log('INDEX' + this.state.currentBookIndex);
    const bodyData = {
      search: this.state.prevSearch,
      code,
      index: this.state.currentBookIndex,
      numBooks: 4,
    };

    try {
      //SEND REQUEST TO SERVER TO GET EBOOKS
      const token = localStorage.getItem('token');
      const response = await fetch('http://192.168.1.15:8080/api/ebooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(bodyData),
      });
      this.setState((prevState) => {
        return {
          ...prevState,

          resultsExpected: prevState.resultsExpected + 8,
        };
      });
      const functionKey = this.state.searchKey;

      const reader = response.body.getReader();
      //Check for incoming chunks
      while (true) {
        //Check whether stream is "done" or a "value" has been sent
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        const resource = processChunk(value);

        if (resource === 'ERROR') {
          console.log('RESULT ERROR');
          this.setState((prevState) => {
            return {
              ...prevState,
              resultsReceived: prevState.resultsReceived + 1,
            };
          });
          continue;
        }

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
            imgLink: resourceDataArr[6],
            key: this.state.currentResultKey,
          };

          if (resourceData.pageCount === '-1') {
            resourceData.pageCount = 'UNKNOWN';
          }

          //Limit title letter count
          const maxLetterCount = Math.round(window.screen.width / 13);
          if (resourceData.title.length > maxLetterCount) {
            resourceData.title =
              resourceData.title.slice(0, maxLetterCount - 1) + '...';
          }

          //make sure to cutoff any incoming results if there is a new search
          if (this.state.searchKey !== functionKey) {
            return;
          }

          //Set the state of the key and the new result
          this.setState((prevState) => {
            return {
              ...prevState,
              currentResultKey: prevState.currentResultKey + 1,
              results: [...prevState.results, resourceData],
              loading: false,
              resultsReceived: prevState.resultsReceived + 1,
            };
          });
          // document.querySelector('#results').appendChild(resultItem);
        });
      }
    } catch (error) {
      console.log(error);
    }

    this.setState((prevState) => {
      return {
        ...prevState,
        currentBookIndex: prevState.currentBookIndex + 4,
      };
    });
  }

  async handleSearch(e) {
    e.preventDefault();

    //SET SEARCH VAL
    const search = document.querySelector('#search').value;

    //RETURN IF SEARCH VALUE HASN'T CHANGED FROM PREVIOUS SEACH IN ORDER TO REDUCE COST OF BANDWIDTH
    if (this.state.prevSearch === search) {
      return;
    }

    //Remove current results

    document.querySelector('#results').classList.remove('are-results');
    document.querySelector('.see-more').style.display = 'none';
    //Set new search key and init key for this instance of handleSearch function
    const numberOfResultsWanted = 8;

    this.setState((prevState) => {
      return {
        ...prevState,
        searchKey: prevState.searchKey + 1,
        prevSearch: search,
        currentBookIndex: 0,
        results: [],

        resultsExpected: prevState.resultsExpected + 8,
      };
    });

    //GET DATA FROM SEARCH BAR
    const bodyData = {
      search,
      index: 0,
      numBooks: Math.round(numberOfResultsWanted / 2),
      code,
    };

    try {
      //SEND REQUEST TO SERVER TO GET EBOOKS
      const token = localStorage.getItem('token');
      const response = await fetch('http://192.168.1.15:8080/api/ebooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(bodyData),
      });

      const functionKey = this.state.searchKey;
      const reader = response.body.getReader();
      //Check for incoming chunks
      while (true) {
        //Check whether stream is "done" or a "value" has been sent
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        const resource = processChunk(value);

        //Check if result had error
        if (resource === 'ERROR') {
          console.log('RESULT ERROR');
          this.setState((prevState) => {
            return {
              ...prevState,
              resultsReceived: prevState.resultsReceived + 1,
            };
          });
          continue;
        }

        //console.log('EXPECTED: ' + this.state.resultsExpected);
        console.log('RECEIVED: ' + this.state.resultsReceived);

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
            imgLink: resourceDataArr[6],
            key: this.state.currentResultKey,
          };

          if (resourceData.pageCount === '-1') {
            resourceData.pageCount = 'UNKNOWN';
          }

          //Limit title letter count
          const maxLetterCount = Math.round(window.screen.width / 13);
          if (resourceData.title.length > maxLetterCount) {
            resourceData.title =
              resourceData.title.slice(0, maxLetterCount - 1) + '...';
          }

          //Set are results class and see-more button
          const resultsEle = document.querySelector('#results');
          if (!resultsEle.classList.contains('are-results')) {
            resultsEle.classList.add('are-results');

            document.querySelector('.see-more').style.display = 'block';
          }

          //MAKE
          if (this.state.searchKey != functionKey) {
            return;
          }

          //Set the state of the key and the new result
          this.setState((prevState) => {
            return {
              ...prevState,
              currentResultKey: prevState.currentResultKey + 1,
              results: [...prevState.results, resourceData],
              resultsReceived: prevState.resultsReceived + 1,
            };
          });
        });
      }
    } catch (error) {
      console.log(error);
    }

    this.setState((prevState) => {
      return {
        ...prevState,
        currentBookIndex: prevState.currentBookIndex + 4,
      };
    });
  }
  /**/
  render() {
    return (
      <div className="body">
        <div className="username">
          <div className="username__name">{this.state.userData.username}</div>
          <i className="fas fa-caret-down username__dd-arrow"></i>
        </div>

        <div className="drop-down">
          <div className="drop-down__item">
            <a className="drop-down__item__link" onClick={this.handleSignOut}>
              Sign Out
            </a>
          </div>
          {/*
          <div className="drop-down__item">
            <a className="drop-down__item__link">Profile</a>
          </div>
          <div className="drop-down__item">
            <a className="drop-down__item__link">History</a>
          </div>
          <div className="drop-down__item">
            <a className="drop-down__item__link">Friends</a>
          </div>*/}
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
              <button
                type="submit"
                className="search__bar-wrapper__submit-btn"
                value=""
              >
                <i className="fas fa-search search__bar-wrapper__submit-btn__icon"></i>
              </button>
            </form>
          </section>

          <section className="results" id="results">
            {this.state.results.map((result) => {
              return (
                <SearchResult
                  title={result.title}
                  author={result.author}
                  source={result.source}
                  fileFormat={result.fileFormat}
                  link={result.link}
                  pageCount={result.pageCount}
                  imgLink={result.imgLink}
                  key={result.key}
                />
              );
            })}
            {this.state.resultsExpected !== this.state.resultsReceived ? (
              <div class="loading-spinner"></div>
            ) : null}
          </section>
          <div className="see-more" onClick={this.handleSeeMore}>
            <p className="see-more__text">See More</p>
          </div>
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
/*function controlResultsBorder(e) {
  e.preventDefault();
  document.querySelector('#results').classList.add('are-results');
}*/

//PROCESS CHUNK FOR WHEN SEARCH TAKES PLACE
function processChunk(chunk) {
  let result = new TextDecoder('utf-8').decode(chunk);
  return result;
}
