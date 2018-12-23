const shell = require('shelljs');
const watch = require('watch');
const fs = require('fs');

function parseHtmlPath(files) {
  const keywords = {};
  for (let index = 0; index < files.length; index++) {
    const file = files[index].replace(/\\/g, "/");
    if (file.match(/.*\.html/)) {
      const keyReg = /([^\$])\$|^\$([^\$])/i;
      let key = file.replace(/.*\/(.*).html/, "$1")
      while (key.match(keyReg)){
        key = key.replace(keyReg, "$1/$2");
      }
      key = key.replace(/\$\$/g, "$");
      keywords[key] = `/${file}`;
    }
  }
  return keywords;
}

function getKeywords(directories) {
  const map = {};
  for (let index = 0; index < directories.length; index++) {
    const obj = {};
    const topic = directories[index].replace(/.\/info\/topics\/(.*)\/keywords\//g, '$1');
    const key = topic;
    map[key] = parseHtmlPath(shell.find(`./info/topics/${topic}/keywords/`));
  }

  return map;
}

watch.watchTree('./info/topics/', function () {
  console.log('file updated');
  const directories = shell.ls('-d', './info/topics/**/keywords/');
  const keywords = getKeywords(directories);
  fs.writeFile('./info/config.json', JSON.stringify(keywords, null, 2));
});
