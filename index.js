var express = require('express');
var path = require('path');
var fs = require('fs')
var morgan = require('morgan')
var path = require('path')

const mzfs = require("mz/fs");

const http = require('http');
const https = require('https');

// const options = {
//     cert: fs.readFileSync('./sslcert/fullchain.pem'),
//     key: fs.readFileSync('./sslcert/privkey.pem')
// };

const {key, cert} = await (async () => {
	const certdir = (await mzfs.readdir("/etc/letsencrypt/live"))[0];

	return {
		key: await mzfs.readFile(`/etc/letsencrypt/live/${certdir}/privkey.pem`),
		cert: await mzfs.readFile(`/etc/letsencrypt/live/${certdir}/fullchain.pem`)
	}
})();

var app = express();

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

const httpsServer = https.createServer({key, cert}, app).listen(443)

console.log(httpsServer);

// app.listen(80);

