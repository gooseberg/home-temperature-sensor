const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Particle = require('particle-api-js');
require('dotenv').config();
// TODO: Convert to ES6 Imports
const port = process.env.PORT || 8000;
var particle = new Particle();
// TODO: Fix to let or const

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});

const devices = new Map([
	[process.env.DEVICE_0_NAME, process.env.DEVICE_0_ID], 
	[process.env.DEVICE_1_NAME, process.env.DEVICE_1_ID],
	[process.env.DEVICE_2_NAME, process.env.DEVICE_2_ID]
]);
// TODO: Update devices to better solution than hardcoding to environment

/**
 * Makes a request to the particle server with the environment token and passed in params
 * @param {Object} params 
 * @param {Object} options 
 * @return {Promise} returns a promise from one of the functions in particle request lookup table
 */
const particleRequest = (params, options) => {
	let token = process.env.PARTICLE_TOKEN;
	let func = particleRequestLookup[params.action] || null;
	// Looks up the function that should be called on particle SDK
	let baseOptions = { auth: token, deviceId: params.id, name: params.name};
	// establishes base options
	let finalOptions = Object.assign({}, baseOptions, options);
	// creates a new object with passed in options overwriting any base options
	// TODO: If empty options are passed in, will have a bug. Fix this.
	return func(finalOptions);
};

const devicePromises = (devices, promisesCallback) => {
	return promisesCallback(devices);
}
/**
 * For each device, push a new promise to the array, then return that array when done
 * @param {Array} devices 
 * @return {Array} array of promises
 */
const devicesPromises = (devices) => {
	let promises = [];
	devices.forEach((device) => {
		let params = {action: 'getDevice', id: device};
		let promise = particleRequest(params);
		promises.push(promise);
	});
	return promises;
}

app.get('/device/:id/temp', (req, res) => {
	// gets the temperature for one device, given an id 
	let id = req.params.id
	// gets the id from the url
	particleRequest({id, name: 'temp', action: 'getVariable'})
		.then(json => {
			// make a particleRequest for temperature from the id passed in
			res.json({temperature: json.body.result})
			// return the temperature as json
		}).catch(err => {
			res.json({
				temperature: null,
			})
			// if there is an error, return null temperature
		})
});

app.get('/devices/', (req, res) => {
	// get all the devices for our const, devices
	let promises = devicePromises(devices, devicesPromises);
	// get an array of promises
	Promise.all(promises).then((values) => {
		// when they are all done
		let data = values.map(deviceBody => new Device(deviceBody.body));
		// make an array of new devices for each one
		let response = {
			data,
			success: true
		}
		res.json(response);
		// return that as json to the front-end
	}).catch(error => {
		// catch any error in retrieving devices
		res.status(400);
		res.send({message: 'Unauthorized API call', error, success: false});
		console.error(error);
	});
});

/**
 * Device class for returning to front end
 *
 * @class Device
 */
class Device {
	/**
	 * Creates an instance of Device.
	 * @param {Object} particleDevice
	 * @memberof Device
	 */
	constructor(particleDevice) {
		this.name = particleDevice.name;
		this.connected = particleDevice.connected;
		this.status = particleDevice.status;
		this.functions = particleDevice.functions;
		this.variables = particleDevice.variables;
		this.id = particleDevice.id;
	}
}

const particleRequestLookup = {
	'getVariable': particle.getVariable.bind(particle),
	'callFunction': particle.callFunction.bind(particle),
	'getDevice': particle.getDevice.bind(particle),
}
// lookup table for accessing particle functions, bound to the particle sdk, for accessing device information
