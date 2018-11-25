import React, { Component } from 'react';
import './App.css';
const convertTemp = (temp) => {
  return temp/1000;
}
const DeviceCard = (props, key) => {
  console.log('props in device card', props);
  return (
    <div key={key}>
      <h3>{props.name}</h3>
      <p>Status {props.status}</p>
      <p>Connected? {props.connected ? 'yes' : false}</p>
      <p>Temperature: {convertTemp(props.temperature) || 'Loading...'}</p>
    </div>
  );
}
class Devices extends Component {
  constructor(props) {
    super(props);
    this.state = {devices: []};
    this.getDevices()
        .then(resp => resp.json()
        .then(json => {
          console.log(json);
          this.setState({devices: json.data});
        }));
  }
  render() {
    console.log(this.state);
    return (
      <div>
        {
          this.state.devices.map(device => (
          <DeviceCard name={device.name} status={device.status} 
            connected={device.connected} temperature={device.temperature}>
          </DeviceCard>))
        }
      </div>
    );
  }
  getDevices() {
    return this.getRequest('/devices/');
  }
  async getRequest(reqUrl, params = {}, base = window.location) {
    let url = new URL(reqUrl, base);
    let urlSearchParams = new URLSearchParams();
    Object.keys(params).forEach(key => urlSearchParams.append(key, params[key]));
    url.search = urlSearchParams.toString();
    return fetch(url.toString());
  }
}
class App extends Component {
  render() {
    return (
      <div>
        <h1>House Devices</h1>
        <Devices></Devices>
      </div>
    );
  }
}

export default App;
