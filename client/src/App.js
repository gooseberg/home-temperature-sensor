import React, { Component } from 'react';
import './App.css';
import { throws } from 'assert';
const formatTemp = (temp) => {
  return temp ? `${temp/1000} °C` : null;
}
const DeviceCard = (props, key) => {
  return (
    <div key={key}>
      <h3>{props.name}</h3>
      <p>Status {props.status}</p>
      <p>Connected? {props.connected ? 'yes' : false}</p>
      <p>Temperature: {formatTemp(props.temperature)|| 'Attempting to load device data...'}</p>
    </div>
  );
}
class Devices extends Component {
  constructor(props) {
    super(props);
    this.state = {devices: []};
    this.devicesMap = new Map();
    this.getDevices()
        .then(json => {
          this.setState({devices: json.data});
          json.data.forEach(device => this.devicesMap.set(device.id, device));
          this.getTemps();
        });
  }
  render() {
    return (
      <div>
        {
          this.state.devices.map((device, index) => (
          <DeviceCard name={device.name} status={device.status} 
            connected={device.connected} temperature={device.temperature} key={index}>
          </DeviceCard>))
        }
      </div>
    );
  }
  getTemps() {
    let devices = this.state.devices;
    devices.forEach(device => this.getTemp(device));
  }
  getTemp(device) {
    console.log('getting temp for', device);
    const DEVICE_ID = device.id
    this.getRequest(`/device/${DEVICE_ID}/temp`)
        .then(json => {
          device.temperature = json.temperature;
          console.log('array from devicesMap', Array.from(this.devicesMap));
          let devices = [];
          this.devicesMap.forEach(device => devices.push(device));
          this.setState({devices});
        });
  }
  getDevices() {
    return this.getRequest('/devices/');
  }
  async getRequest(reqUrl, params = {}, base = window.location) {
    let url = new URL(reqUrl, base);
    let urlSearchParams = new URLSearchParams();
    Object.keys(params).forEach(key => urlSearchParams.append(key, params[key]));
    url.search = urlSearchParams.toString();
    return fetch(url.toString()).then(resp => resp.json());
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
