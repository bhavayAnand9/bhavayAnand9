var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs')
var morgan = require('morgan')
var path = require('path')

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
 
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/logs', function(req, res) {
    if(req.query.password === "bhavay"){
        res.sendFile(path.join(__dirname + '/access.log'));
    }else {
        res.send();
    }
});

app.listen(80);
