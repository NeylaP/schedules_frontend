import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import LoginPage from '../components/general/Login.js';
// import TablePage from './pages/TablePage';

function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={LoginPage} />
        {/* <Route path="/table" component={TablePage} /> */}
      </Switch>
    </Router>
  );
}

export default Routes;