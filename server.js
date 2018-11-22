const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Particle = require('particle-api-js');
const path = require('path');
require('dotenv').config();

const hostname = '192.168.11.8';
const port = process.env.PORT || 8000;
var particle = new Particle();
var token;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
	console.warn(`particle key`, process.env.)
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
app.get('/toggle', function (req, res) {
	console.log('recieved get req');
	res.send('It worked');
});

app.post('/toggle', function (req, res) {
	console.log('recieved post req');
	res.send('It worked');
});