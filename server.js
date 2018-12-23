const express = require("express");
const shell = require('shelljs');
const fs = require('fs');
const bodyParser = require('body-parser');

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

function fileToJson(id, res) {
  const promises = [];
  const ret = {};
  const r = ()=>{};
  const p = new Promise(r, ()=>{});
  promises.push(p);
  ret.index = shell.exec(`cat ./info/topics/${id}/index.html`);
  ret.config = shell.exec(`cat ./info/topics/${id}/config.json`);
  ret.internalConfig = shell.exec(`cat ./info/topics/${id}/intConfig.json`);
  ret.style = shell.exec(`cat ./info/topics/${id}/style.css`);
  ret.keywords = {};
  const files = shell.find(`./info/topics/${id}/keywords/`);
  for (let index = 0; index < files.length; index++) {
    const file = files[index].replace(/\\/g, "/");
    if (file.match(/.*\.html/)) {
      const keyReg = /([^\$])\$|^\$([^\$])/i;
      let key = file.replace(/.*\/(.*).html/, "$1")
      while (key.match(keyReg)){
        key = key.replace(keyReg, "$1/$2");
      }
      key = key.replace(/\$\$/g, "$");
      const escape = file.replace(/\$/g, "\\$");
      console.log("file: " + escape);
      ret.keywords[key] = shell.exec(`cat ./${escape}`);
    }
  }
  // while (poll.indexOf(false) > -1) (setTimeout(function () {}, 100));
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(ret, null, 2));
}

function idToPath(id) {
  return id.replace(/\./g, "/");
}

function sendTopicJson(id, res) {
  fs.readFile(`./info/topics/${id}/topic.json`, 'utf8', function (err, data) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'application/json');
    if (err) {
      res.send({content: '', data: {}, links: {}, css: '', keywords: {}});
    } else {
      res.send(data);
    }
  });
}

function saveTopicJson(id, data, res) {
  console.log(`Saving ${id}`)
  const dir = `./info/topics/${id}`;
  const fp = `${dir}/topic.json`;
  shell.mkdir('-p', dir);
  shell.exec(`touch ${fp}`)
  fs.writeFile(fp, JSON.stringify(data, null, 2), 'utf8', function (err, data) {
    console.log('Saved!');
    res.send('success');
  });
}

app.get('/:id', function (req, res) {
  const id = req.params.id;
  sendTopicJson(idToPath(id), res);
});

app.post('/:id', function (req, res) {
  const id = req.params.id;
  const data = req.body;
  saveTopicJson(idToPath(id), data, res);
});

app.get('f2j/:id', function (req, res) {
  const id = req.params.id;
  console.log("id: " + id)
  contentObj(idToPath(id), res);
});

app.listen(3100, function(){});
