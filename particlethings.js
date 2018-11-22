const http 			= 	require('http');
const express 		= 	require('express');
const bodyParser	= 	require('body-parser');
const app 			= 	express();
const Particle 		= 	require('particle-api-js');

const hostname = '192.168.11.6';
const port = 8000;
var particle = new Particle();
var token;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile('C:/Users/Robin/Desktop/Photon/index.html');
});

app.listen(port, hostname, () => {
	console.log('Server running at http://'+hostname+':'+port+'//');
});

app.post('/login',function(req, res){
	var userName=req.body.user;
	var password=req.body.password;
	if(userName=='admin' && password=='default'){
		console.log("Attempting to log in with default user pass");
		userName='robismor@gmail.com';
		password=Buffer.from('ZWxkZWxyb2JzdGVy', 'base64').toString("ascii");
	}
	particle.login({username: userName, password: password}).then(
	function(data) {
		token = data.body.access_token;
		console.log('Logged in successfully.');
	},
	function (err) {
		console.log('Could not log in.', err.body);
	});
});

app.post('/toggle',function(req, res){
	console.log('recieved post req');
	res.send('It worked');
});