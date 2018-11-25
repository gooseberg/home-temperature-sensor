const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Particle = require('particle-api-js');
const path = require('path');
require('dotenv').config();

const port = process.env.PORT || 8000;
var particle = new Particle();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.sendFile(`${__dirname}/index.html`);
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);

});

app.get('/api', function (req, res) {
	res.send('It worked');
});

app.post('/api', (req, res) => {
	let action = req.body.action;
	postRequest(req, particleRequest).then(resp => {
		handleParticleResp(resp, action, res);
	});
});

const devices = new Map([
	[process.env.DEVICE_0_NAME, process.env.DEVICE_0_ID], 
	[process.env.DEVICE_1_NAME, process.env.DEVICE_1_ID],
	[process.env.DEVICE_2_NAME, process.env.DEVICE_2_ID]
]);

const particleRequest = (params, options) => {
	let token = process.env.PARTICLE_TOKEN;
	let func = particleRequestLookup[params.action] || null;
	let baseOptions = { auth: token, deviceId: params.id, name: params.name};
	let finalOptions = Object.assign({}, baseOptions, options);
	return func(finalOptions);
};
const devicePromises = (devices, promisesCallback) => {
	return promisesCallback(devices);
}
const devicesPromises = (devices) => {
	let promises = [];
	devices.forEach((device) => {
		let params = {action: 'getDevice', id: device};
		let promise = particleRequest(params);
		promises.push(promise);
	});
	return promises;
}
const tempPromises = (devices) => {
	let promises = [];
	devices.forEach((device) => {
		let params = {action: 'getVariable', id: device, name: 'temp'};
		let promise = particleRequest(params);
		promises.push(promise);
	});
	return promises;
}
app.get('/device/:id/temp', (req, res) => {
	let id = req.params.id
	particleRequest({id, name: 'temp', action: 'getVariable'})
		.then(json => {
			res.json({temperature: json.body.result})
		}).catch(err => {
			res.json({
				temperature: null,
			})
		})
});

app.get('/devices/', (req, res) => {
	let promises = devicePromises(devices, devicesPromises);
	Promise.all(promises).then((values) => {
		let data = values.map(deviceBody => new Device(deviceBody.body));
		let response = {
			data,
			success: true
		}
		res.send(JSON.stringify(response));
	}).catch(error => {
		res.status(400);
		res.send({message: 'Unauthorized API call', error, success: false});
		console.error(error);
	});
});

class Device {
	constructor(particleDevice) {
		this.name = particleDevice.name;
		this.connected = particleDevice.connected;
		this.status = particleDevice.status;
		this.functions = particleDevice.functions;
		this.variables = particleDevice.variables;
		this.id = particleDevice.id;
	}
}
const handleParticleResp = (resp, type, res) => {
	let out = {value: resp.body.result, success: true};
	res.send(JSON.stringify(out));
}

const particleRequestLookup = {
	'getVariable': particle.getVariable.bind(particle),
	'callFunction': particle.callFunction.bind(particle),
	'getDevice': particle.getDevice.bind(particle),
}



const postRequest = (req, callback, options = {}) => {
	let body = req.body;
	if (body.argument) {
		options.argument = body.argument;
	}
	return callback(body, options);
}
