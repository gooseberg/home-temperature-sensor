import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  postInit(data) {
    return {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      }
    }
  }
  postToggle(data) {
    let init = this.postInit(data);
    const URL = '/api';
    fetch(URL, init).then(resp => console.log(resp));
  }
  toggleOn = (e) => {
    console.log('toggling on', this, e);
    this.postToggle({toggle: true});
  }
  toggleOff = (e) => {
    console.log('toggling on', this, e);
    this.postToggle({toggle: false});
  }
  render() {
    return (
      <div>
        <button onClick={this.toggleOn}> Toggle On </button>
        <button onClick={this.toggleOff}> Toggle Off </button>
      </div>
    );
  }
}

export default App;
