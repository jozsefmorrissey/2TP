const express = require("express");
const bodyParser = require('body-parser');
const shell = require('shelljs');

shell.config.silent = true;

const configJsonStr = shell.exec(`confidentalInfo.sh toJson 2TP`).stdout.trim();
const config = JSON.parse(configJsonStr)

function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(allowCrossDomain);


app.get('/config', function (req, res) {
  const id = req.params.id;
  res.setHeader('Content-Type', 'application/json');
  res.send(config);
});

app.listen(3167, function(){});


console.log(JSON.stringify(config, null, 2))
