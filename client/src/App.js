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
    this.postToggle({action: 'callFunction', name: 'led', argument: '1'});
  }
  toggleOff = (e) => {
    console.log('toggling on', this, e);
    this.postToggle({action: 'callFunction', name:'led', argument: '0'});
  }
  getPin = (e) => {
    console.log('getting pin', this, e);
    this.postToggle({action: 'getVariable', name: 'pin'})
  }
  render() {
    return (
      <div>
        <button onClick={this.toggleOn}> Toggle On </button>
        <button onClick={this.toggleOff}> Toggle Off </button>
        <button onClick={this.getPin}>Get Pin</button>
      </div>
    );
  }
}

export default App;
