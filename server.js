const express = require("express");
const shell = require('shelljs');
const fs = require('fs');
const bodyParser = require('body-parser');
const Promise = require('bluebird');

const searchMap = require('./info/searchMap.json');
const config = require('./webapp/hlwa/src/constants/config.js').config;
const mapSrvc = require('./webapp/hlwa/src/services/stringMapSrvc');
console.log(config.PORT);

fs.readFileAsync = Promise.promisify(fs.readFile);

Promise.allComplete = (iterable) => {
    if (!Array.isArray(iterable)) {
        throw new TypeError('Invalid argument, expected "iterable" to be an array');
    }

    const completed = {
        resolved: [],
        rejected: [],
    };

    const wrapResolutionOrRejection = (type, index) => valueOrReason => (completed[type][index] = valueOrReason);
    const wrappedIterable = iterable.map((value, index) =>
        Promise.resolve(value)
            // The rejected wrapper function could be put in the catch, but it's wasteful for our purposes
            .then(wrapResolutionOrRejection('resolved', index), wrapResolutionOrRejection('rejected', index))
    )

    return Promise.all(wrappedIterable)
        .then(() => completed.rejected.length === 0 ? Promise.resolve(completed.resolved) : Promise.reject(completed));
};

function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

var app = express();
app.use(express.static('webapp'))
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(allowCrossDomain);

function buildTopicTree() {
  const topicPaths = shell.find('./info/topics/').filter(function (file) {
    return file.match(/topic\.json$/);
  });

  const tree = {};
  for (let index = 0; index < topicPaths.length; index += 1) {
    let node = tree;
    const fpReg = /.*info\/topics\/(.*)\/topic\.json/;
    const idFilePath = topicPaths[index].replace(fpReg, '$1');
    console.log(topicPaths[index] + " => " + idFilePath);
    let breakdown = idFilePath.split('/');
    for (let bIndex = 0; bIndex < breakdown.length; bIndex += 1) {
      const id = breakdown[bIndex];
      if(node[id] === undefined) {
        node[id] = {}
      }
      node = node[id];
    }
  }
  return tree;
}
const topicTree = buildTopicTree();

function idToPath(id) {
  return id.replace(/\./g, "/");
}

function sendTopicJson(id, res) {
  const promises = [];
  const ids = id.split('/');
  const jsons = {};

  function addJson(jId) {
    return function (data) {
      jsons[jId] = JSON.parse(data);
    }
  }

  function buildKeywords() {
    inheritedKeywords = {};
    const target = jsons[ids[ids.length - 1]];
    let keywords;
    if (target) {
      keywords = Object.keys(target.keywords);
    } else {
      keywords = [];
    }
    for (let index = 0; index < ids.length - 1; index += 1) {
      const id = ids[index];
      if (jsons[id]) {
        const parentKeywords = jsons[id].keywords;
        const parentKeys = Object.keys(parentKeywords);
        for (let kIndex = 0; kIndex < parentKeys.length; kIndex += 1) {
          const key = parentKeys[kIndex];
          const value = parentKeywords[key];
          if (keywords.indexOf(key) === -1) {
            inheritedKeywords[key] = value;
          }
        }
      }
    }
    const parentKeys = Object.keys(inheritedKeywords);

    return inheritedKeywords;
  }

  res.setHeader('Content-Type', 'application/json');
  let currId = '';
  for (let index = 0; index < ids.length; index += 1) {
    currId += ids[index] + '/';
    ids[index] = currId.substr(0, currId.length - 1);
    const fileLoc = `./info/topics/${ids[index]}/topic.json`;
    const promise = fs.readFileAsync(fileLoc, 'utf8');
    promise.then(addJson(ids[index]), () => {});
    promises.push(promise);
  }

  function respond() {
    const target = jsons[ids[ids.length - 1]];
    if (target) {
      target.inheritedKeywords = buildKeywords();
      res.send(target);
    } else {
      res.send({content: '', data: {}, links: {}, css: '', keywords: {}, inheritedKeywords: buildKeywords()});
    }
  }

  Promise.allComplete(promises).then(respond, respond);
}

function saveUpdateMap(id, map) {
  searchMap[id] = map;
  fs.writeFile('./info/searchMap.json', JSON.stringify(searchMap));
}

function log(filePath, data, comment) {
  shell.exec(`touch ${filePath}`);
  fs.appendFile(filePath, `${JSON.stringify(data)},\n`, 'utf8');
}

function saveJson(filePath, data, res) {
  const dir = filePath.replace(/(.*\/).*/, '$1');
  shell.mkdir('-p', dir);
  shell.exec(`touch ${filePath}`);
  fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', function (err, data) {
    console.log('Saved!');
    if (res) {
      res.send('success');
    }
  });
}

function search(searchTerms, startIndex, resultCount) {
  let matches = [];
  const keys = Object.keys(searchMap);
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];
    let total = 0;
    for (let sIndex = 0; sIndex < searchTerms.length; sIndex += 1) {
      const word = searchTerms[sIndex];
      const count = searchMap[key][word];
      if (count) {
        total += count;
      }
    }
    matches.push({key, total});
  }
  matches.sort(function (mat1, mat2) {return mat1.total < mat2.total});
  matches = matches.map(a => a.key);
  return matches.splice(startIndex, resultCount);
}

function saveTopicJson(id, data, comment, res) {
  console.log(`Saving ${id}`)
  const date = new Date();
  const fileId = `${date.getFullYear()}-${date.getMonth()}`;
  const dir = `./info/topics/${id}`;
  const fp = `${dir}/topic.json`;
  const lp = `${dir}/map.log`;
  const bckup = `${dir}/${fileId}.log`;
  const logData = {date, fileId, comment};
  saveJson(fp, data, res);
  log(lp, logData);
  log(bckup, data);
}

app.get(`/${config.ENDPOINT_PAGE}:id`, function (req, res) {
  const id = req.params.id;
  sendTopicJson(idToPath(id), res);
});

app.post(`/${config.ENDPOINT_PAGE}:id`, function (req, res) {
  // TODO: user verification
  try {
    const id = req.params.id;
    const data = req.body.body;
    const comment = req.body.comment;
    const map = mapSrvc.stringMapSrvc(req.body.body);
    saveTopicJson(idToPath(id), JSON.parse(data), comment, res);
    saveUpdateMap(id, map);
  } catch (e) {
    res.send(e);
  }
});

app.post(`/${config.ENDPOINT_SEARCH}`, function(req, res) {
  const searchTerms = req.body.searchTerms;
  const startIndex = req.body.startIndex;
  const resultCount = req.body.resultCount;
  const searchResults = search(searchTerms, startIndex, resultCount);
  res.setHeader('Content-Type', 'application/json');
  res.send(searchResults);
});

app.get(`/${config.ENDPOINT_CHILDREN}`, function (req, res){
  res.setHeader('Content-Type', 'application/json');
  res.send(Object.keys(topicTree));
});

app.get(`/${config.ENDPOINT_CHILDREN}:id`, function (req, res){
  const ids = req.params.id.split('.');
  res.setHeader('Content-Type', 'application/json');
  let node = topicTree;
  for (let index = 0; index < ids.length; index += 1) {
    id = ids[index];
    if (node[id] === undefined) {
      throw new Error(`Invalid identifier '${req.params.id}' Failed at '${id}'`);
    }
    node = node[id];
  }
  res.send(Object.keys(node));
});

// app.getRevision('/topic/revision/:id', function () {
//
// });

app.listen(config.PORT, function(){});
