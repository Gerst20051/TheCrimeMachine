import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';

// import Dashboard from './components/Dashboard';
import CrimeMap from './components/Map';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" component={Dashboard}/>
          <Route path="/map" component={CrimeMap}/>
        </Switch>
      </Router>
    )
  }

}

export default App;
