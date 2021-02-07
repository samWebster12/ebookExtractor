import React from 'react';
import verifyToken from '../utils/verifyToken';
import '../css/base.css';
import '../css/search.css';
import logo from '../images/logo2.png';
import nocover from '../images/nocover.jpg';

class Search extends React.Component {
  constructor() {
    super();
    this.handleSignOut = this.handleSignOut.bind(this);
    this.state = {
      userData: {},
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
  /**/
  render() {
    return (
      <div className="body">
        <div className="username">
          <div className="username__name">
            {/*this.state.userData.username*/ 'a;sdjf;lkfsaSammyBoy12'}
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
            {/*} <div class="search__bar-wrapper">
              <input
                type="text"
                class="search__bar-wrapper__bar"
                placeholder="Search An Ebook Title"
              />
              <button class="search__bar-wrapper__submit-btn">
                <i class="fas fa-search search__bar-wrapper__submit-btn__icon"></i>
              </button>
            </div>*/}

            <form className="search__bar-wrapper">
              <input
                type="text"
                className="search__bar-wrapper__bar"
                placeholder="Search An Ebook Title"
              />
              <input
                type="submit"
                className="search__bar-wrapper__submit-btn"
                value=""
              />
              <i className="fas fa-search search__bar-wrapper__submit-btn__icon"></i>
            </form>
          </section>
          <section className="results">
            <div className="results__item">
              <img src={nocover} className="results__item__cover" />
              <div className="results__item__main-section">
                <div className="results__item__main-section__heading">
                  <p className="results__item__main-section__heading__title">
                    Percy Jackson The Complete Series
                  </p>
                  <p className="results__item__main-section__heading__author">
                    Rick Riordan
                  </p>
                </div>
                <div className="results__item__main-section__info">
                  <div className="results__item__main-section__info__filetype">
                    <p>
                      File:
                      <span className="results__item__main-section__info__data">
                        EPUB
                      </span>
                    </p>
                  </div>
                  <div className="results__item__main-section__info__source">
                    <p>
                      Source:
                      <span className="results__item__main-section__info__data">
                        ZLibrary
                      </span>
                    </p>
                  </div>
                  <div className="results__item__main-section__info__page-count">
                    Pages:
                    <span className="results__item__main-section__info__data">
                      455
                    </span>
                  </div>
                </div>
                <div className="results__item__main-section__download">
                  <button className="results__item__main-section__download__btn btn">
                    Download
                  </button>
                </div>
              </div>
            </div>

            <div className="results__item">
              <img src={nocover} className="results__item__cover" />
              <div className="results__item__main-section">
                <div className="results__item__main-section__heading">
                  <p className="results__item__main-section__heading__title">
                    Percy Jackson The Complete Series
                  </p>
                  <p className="results__item__main-section__heading__author">
                    Rick Riordan
                  </p>
                </div>
                <div className="results__item__main-section__info">
                  <div className="results__item__main-section__info__filetype">
                    <p>
                      File:
                      <span className="results__item__main-section__info__data">
                        EPUB
                      </span>
                    </p>
                  </div>
                  <div className="results__item__main-section__info__source">
                    <p>
                      Source:
                      <span className="results__item__main-section__info__data">
                        ZLibrary
                      </span>
                    </p>
                  </div>
                  <div className="results__item__main-section__info__page-count">
                    Pages:
                    <span className="results__item__main-section__info__data">
                      455
                    </span>
                  </div>
                </div>
                <div className="results__item__main-section__download">
                  <button className="results__item__main-section__download__btn btn">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }
}

export default Search;

function openCloseDropDown(e) {
  console.log('hello');

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

function controlResultsBorder(e) {
  console.log('hello');

  e.preventDefault();
  document.querySelector('.results').classList.add('are-results');
}
