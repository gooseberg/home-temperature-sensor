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
  postRequest(data) {
    let init = this.postInit(data);
    const URL = '/api';
    return fetch(URL, init);
  }
  toggleOn = (e) => {
    console.log('toggling on', this, e);
    this.postRequest({action: 'callFunction', name: 'led', argument: '1'});
  }
  toggleOff = (e) => {
    console.log('toggling on', this, e);
    this.postRequest({action: 'callFunction', name:'led', argument: '0'});
  }
  getTemp = (e) => {
    console.log('getting temp', this, e);
    this.postRequest({action: 'getVariable', name: 'temp'})
      .then((resp) => {
        resp.json()
            .then(json => {
              console.log(json);
              this.setState({temp: this.convertTemp(json.value)});
            })
        });
  }
  convertTemp(temp) {
    return Math.floor(temp/1000);
  }
  render() {
    return (
      <div>
        <button onClick={this.toggleOn}> Toggle On </button>
        <button onClick={this.toggleOff}> Toggle Off </button>
        <button onClick={this.getTemp}>Get Temp</button>
        <h1>{this.state ? `${this.state.temp} deg c` : 'No Data'}</h1>
      </div>
    );
  }
}

export default App;
