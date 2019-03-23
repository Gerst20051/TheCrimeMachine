import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';

import CrimeMap from './components/Map';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Dashboard}/>
          <Route exact path="/map" component={CrimeMap}/>
        </Switch>
      </Router>
    )
  }

}

export default App;
