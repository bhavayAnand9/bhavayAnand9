var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs')
var morgan = require('morgan')
var path = require('path')


var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }) 
app.use(morgan('combined', { stream: accessLogStream }))

// app.use(express.static(__dirname, { dotfiles: 'allow' } ));
app.use(express.static(__dirname + '/static', { dotfiles: 'allow' } ))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
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

app.listen(80);
