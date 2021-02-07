import React, { useState } from 'react';
import Search from './Search';
import Signin from './Signin';
import NotFound from './NotFound';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

function App() {
  let [username, setUsername] = useState();
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path="/signin"
          render={(props) => <Signin {...props} setUsername={setUsername} />}
        />
        <Route
          exact
          path="/search"
          render={(props) => (
            <Search {...props} setUsername={setUsername} username={username} />
          )}
        />
        <Route path="/" component={NotFound} />
      </Switch>
    </BrowserRouter>
  );

  // return <Search />;
}

export default App;
