import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  postToggle(options) {
    
  }
  toggleOn = (e) => {
    console.log('toggling on', this, e);
    this.postToggle({toggle:true});
  }
  toggleOff = (e) => {
    console.log('toggling on', this, e);
    this.postToggle({toggle:true});
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
