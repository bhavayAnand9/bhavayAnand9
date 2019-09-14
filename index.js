var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs')
var morgan = require('morgan')
var path = require('path')

const child_process = require('child_process');

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }) 
app.use(morgan('combined', { stream: accessLogStream }))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/push-event', function(req, res){
    try{
        if(req.query.password === "8190"){

            console.log('Spawning sync.sh');
            const process = child_process.spawn('./sync.sh');
            process.on('exit', () => {
                console.log('process exit');
            });
            process.stdout.on('data', (data) => {
                console.log('Output: ' + data.toString('utf8'));
            });

        } else {
            res.send();
        }
    } catch(e){
        res.send(e);
    }
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
