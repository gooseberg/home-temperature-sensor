const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Particle = require('particle-api-js');
const path = require('path');
require('dotenv').config();

const port = process.env.PORT || 8000;
var particle = new Particle();
var token;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.sendFile(`${__dirname}/index.html`);
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);

});

app.get('/api', function (req, res) {
	console.log('recieved get req');
	res.send('It worked');
});

app.post('/api', (req, res) => {
	console.log('recieved post req2', req.body);
	let action = req.body.action;
	postRequest(req, particleRequest).then(resp => {
		handleParticleResp(resp, action, res);
	});
});

const handleParticleResp = (resp, type, res) => {
	console.log('resp', resp, type);
	let out = {value: resp.body.result, success: true};
	res.send(JSON.stringify(out));
}

const requestLookup = {
	'getVariable': particle.getVariable.bind(particle),
	'callFunction': particle.callFunction.bind(particle),
}
const rautek_1 = '44002c001847343337363432';

const particleRequest = (body, options) => {
	let id = rautek_1;
	let token = process.env.PARTICLE_TOKEN;
	let func = requestLookup[body.action] || null;
	let baseOptions = { auth: token, deviceId: id, name: body.name };
	let finalOptions = Object.assign({}, options, baseOptions);
	return func(finalOptions);
};

const postRequest = (req, callback, options = {}) => {
	let body = req.body;
	if (body.argument) {
		options.argument = body.argument;
	}
	return callback(body, options);
}
// app.post('/api', function (req, res) {
// 	console.log('recieved post req', req.body);
// 	let body = req.body;
// 	let token = process.env.PARTICLE_TOKEN;
// 	let devicesReq = particle.listDevices({auth: token});
// 	devicesReq.then(devices => {
// 		console.log(devices.body[0]);
// 		let reece = devices.body[0];
// 		let id = reece.id;
// 		let particleOptions = {auth: token, deviceId: id, name: body.name};
// 		if (body.action === 'getVariable') {
// 			particle.getVariable(particleOptions).then(resp => console.log(resp));
// 		} else if (body.action === 'callFunction') {
// 			particleOptions.argument = body.argument;
// 			console.log(particleOptions);
// 			particle.callFunction(particleOptions).then(resp => console.log(resp), error => console.log(error.body));
// 		}
// 		res.send('It worked');
// 	});
// });