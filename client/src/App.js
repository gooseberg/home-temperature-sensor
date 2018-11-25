import React, { Component } from 'react';
import './App.css';
/**
 * Formats temperature into celsius w/ strings
 * @param {int} temp temp as mili-celsius
 * @return {string|null} if temp is defined, return string, else null
 */
const formatTemp = (temp) => {
  return temp ? `${temp/1000} °C` : null;
}
/**
 * React functional component (https://reactjs.org/docs/components-and-props.html) for rendering individual device cards
 * @param {object} props 
 * @param {int} key 
 * @return {JSX} jsx (https://reactjs.org/docs/introducing-jsx.html) for the device card component
 */
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
/**
 * Extension of React.Component
 * Gets data for a list of devices, as returned by `api/devices/` endpoint
 * @class Devices
 * @extends {Component}
 */
class Devices extends Component {
  /**
   * Creates an instance of Devices.
   * @param {Object} props
   * @memberof Devices
   */
  constructor(props) {
    super(props);
    this.state = {devices: []};
    this.devicesMap = new Map();
    this.updateData();
    setInterval(() => {
      this.updateData();
    }, 10000)
  }
  /**
   * Renders the devices list component
   *
   * @return {JSX} jsx for the Devices list component
   * @memberof Devices
   */
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
  /**
   * Gets temps for this component's devices
   *
   * @memberof Devices
   */
  getTemps() {
    let devices = this.state.devices;
    devices.forEach(device => this.getTemp(device));
  }
  /**
   * gets the temperature for an individual device
   *
   * @param {Object} device
   * @memberof Devices
   */
  getTemp(device) {
    const DEVICE_ID = device.id
    this.getRequest(`/device/${DEVICE_ID}/temp`)
        .then(json => {
          device.temperature = json.temperature;
          let devices = [];
          this.devicesMap.forEach(device => devices.push(device));
          this.setState({devices});
        });
  }
  /**
   * Returns a promise from this.getRequest
   *
   * @return {Promise}
   * @memberof Devices
   */
  getDevices() {
    return this.getRequest('/devices/');
  }
  /**
   * Updates this components data
   * Makes requests via this.getTemps() to get device temperature
   * @memberof Devices
   */
  updateData() {
    this.getDevices()
    .then(json => {
      this.setState({devices: json.data});
      // sets this component's state to the array of devices returned from the `getDevices()` call
      json.data.forEach(device => this.devicesMap.set(device.id, device));
      // loops over that data, updating this.devicesMap with any changes to the devices
      this.getTemps();
      // gets temps for new devices that have bgen saved
    });
  }
  /**
   * makes get requests to the api. async.
   *
   * @param {*} reqUrl url to request from
   * @param {*} [params={}] defaults to empty object
   * @param {*} [base=window.location] defaults to the current location
   * @return {Promise} promise that is then-able to access actual json from the request
   * @memberof Devices
   */
  async getRequest(reqUrl, params = {}, base = window.location) {
    let url = new URL(reqUrl, base);
    let urlSearchParams = new URLSearchParams();
    Object.keys(params).forEach(key => urlSearchParams.append(key, params[key]));
    // makes a url w/ search params to make an api request
    url.search = urlSearchParams.toString();
    // strigifys search params
    return fetch(url.toString()).then(resp => resp.json());
  }
}
/**
 * Outer app component
 *
 * @class App
 * @extends {Component}
 */
class App extends Component {
  /**
   * Renders app
   *
   * @return {JSX}
   * @memberof App
   */
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
