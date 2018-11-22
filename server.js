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

// app.post('/login', function (req, res) {
// 	var userName = req.body.user;
// 	var password = req.body.password;
// 	if (userName == 'admin' && password == 'default') {
// 		console.log("Attempting to log in with default user pass");
// 		userName = 'robismor@gmail.com';
// 		password = Buffer.from('ZWxkZWxyb2JzdGVy', 'base64').toString("ascii");
// 	}
// 	particle.login({ username: userName, password: password }).then(
// 		function (data) {
// 			token = data.body.access_token;
// 			console.log('Logged in successfully.');
// 		},
// 		function (err) {
// 			console.log('Could not log in.', err.body);
// 		});
// });
app.get('/api', function (req, res) {
	console.log('recieved get req');
	res.send('It worked');
});

app.post('/api', function (req, res) {
	console.log('recieved post req', req.body);
	let body = req.body;
	let token = process.env.PARTICLE_TOKEN;
	let devicesReq = particle.listDevices({auth: token});
	devicesReq.then(devices => {
		console.log(devices.body[0]);
		let reece = devices.body[0];
		let id = reece.id;
		let particleOptions = {auth: token, deviceId: id, name: body.name};
		if (body.action === 'getVariable') {
			particle.getVariable(particleOptions).then(resp => console.log(resp));
		} else if (body.action === 'callFunction') {
			particleOptions.argument = body.argument;
			console.log(particleOptions);
			particle.callFunction(particleOptions).then(resp => console.log(resp), error => console.log(error.body));
		}
		res.send('It worked');
	});
	
});