import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import EventInputForm from './EventInputForm.js';
import EventList from './EventList.js';
import EventContainer from './EventContainer.js';

class App extends Component {
  render() {

    return (
        <div className="App">
            <div className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h2 className="App-header-title">Welcome to Visaal and Owen&#39;s Free Food Finder</h2>
            </div>
            <div className="App-intro">
                <EventContainer />
            </div>
        </div>

    );
  }
}

export default App;


/*
<p className="App-intro">
  To get started, edit <code>src/App.js</code> and save to reload.
</p>

*/
