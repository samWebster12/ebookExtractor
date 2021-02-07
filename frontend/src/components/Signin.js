import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import getToken from '../utils/getToken';
import '../css/signin.css';

function Signin({ setUsername }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    const token = await getToken({ username, password });
    if (token.token) {
      localStorage.setItem('token', token.token);
      setUsername(username);
      history.push('/search');
    }
  };

  return (
    <div className="signin---body">
      <div className="signin---signin">
        <div className="signin---signin__banner">
          <div className="signin---signin__banner__heading">Ebookz Today</div>
          <div className="signin---signin__banner__subheading">
            A world of ebooks awaits you
          </div>
        </div>

        <div className="signin---signin__form-area">
          <form
            className="signin---signin__form-area__form"
            onSubmit={handleLogin}
          >
            <input
              type="text"
              className="signin---signin__form-area__form__username input"
              placeholder="Username"
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="password"
              className="signin---signin__form-area__form__password input"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="submit"
              className="signin---signin__form-area__form__submit btn"
              value="Sign In"
            />
          </form>
          <a href="#" className="signin---signin__form-area__forgot-pw">
            Forgot Password?
          </a>
          <button className="signin---signin__form-area__sign-up btn">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signin;
