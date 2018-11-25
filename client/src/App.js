import React, { Component } from 'react';
import './App.css';
const DeviceCard = (props, key) => {
  return (
    <div key={key}>
      <h3>{props.name}</h3>
      <p>Status {props.status}</p>
      <p>Connected? {props.connected ? 'yes' : false}</p>
    </div>
  );
}
class App extends Component {
  constructor(props){
    super(props);
      this.getRequest('/devices/')
          .then(resp => resp
            .json()
            .then(json => {
              console.log(json);
              this.setState({
                devices: json.data.map((device, index) => DeviceCard(device, index))
              })
            })
          );
  }
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
  getRequest(reqUrl, params = {}, base = window.location) {
    let url = new URL(reqUrl, base);
    let urlSearchParams = new URLSearchParams();
    Object.keys(params).forEach(key => urlSearchParams.append(key, params[key]));
    url.search = urlSearchParams.toString();
    return fetch(url.toString());
  }
  convertTemp(temp) {
    return temp/1000;
  }
  render() {
    return (
      <div>
        <h1>House Devices</h1>
        {this.state ? this.state.devices : null};
      </div>
    );
  }
}

export default App;
