// Dependencies
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
var morgan = require('morgan')
const app = express();
var path = require('path')
var helmet = require('helmet');

// Certificate
const privateKey = fs.readFileSync('./sslcert/privkey.pem', 'utf8');
const certificate = fs.readFileSync('./sslcert/cert.pem', 'utf8');
const ca = fs.readFileSync('./sslcert/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }) 

app.use(morgan('combined', { stream: accessLogStream }))
app.use(helmet())
// app.use(express.static(__dirname + '/static', { dotfiles: 'allow' } ))

app.use(express.static("public"));

app.use (function (req, res, next) {
    if (req.secure) {
            // request was via https, so do no special handling
            next();
    } else {
            // request was via http, so redirect to https
            res.redirect('https://' + req.headers.host + req.url);
    }
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + './public/index.html'));
});

app.get('/style.css', function(req, res) {
    res.sendFile(path.join(__dirname + './public/style.css'));
});

app.get('/script.js', function(req, res) {
    res.sendFile(path.join(__dirname + './public/script.js'));
});

app.get('/robot.txt', function(req, res) {
    res.sendFile(path.join(__dirname + './public/robot.txt'));
});

app.get('/logs', function(req, res) {
    try{
        if(req.query.password === "8190"){
            res.sendFile(path.join(__dirname + '/access.log'));
        } else {
            res.send();
        }
    } catch(e){
        res.send(e);
    }
});

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(809, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});
