var fs = require('fs');
var express = require('express');
var https = require('https');

var key = fs.readFileSync('./cert/key.pem');
var cert = fs.readFileSync('./cert/cert.pem');
var app = express();
var port = process.env.PORT || 8080;

const server = https.createServer({key: key, cert: cert }, app);
server.listen(port);
app.use(express.static('docs'));


//var server = app.listen(port);
//app.use(express.static('public'));
