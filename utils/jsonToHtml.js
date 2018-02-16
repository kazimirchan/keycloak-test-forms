var tddJsonConfig = require('../config/config.json');
var path = require('path');
var fs = require('fs');
var ftl2html = require('ftl2html');

/**
 * @description convert json file into required html 
 * @param {string} pathToTheme - path to linked theme in our project
 * @param {string} currentFile - filename for converting
 */
module.exports = function jsonToHtml(pathToTheme, currentFile) {
  if (typeof pathToTheme !== "string" || typeof currentFile !== "string") {
    throw new Error('jsonToHtml: Invalid path to theme');
  }
  fs.readFile(path.resolve(pathToTheme, 'login/messages/messages_en.properties'), 'utf-8', (err, data) => {
    if (!!err) {
      throw new Error(err);
    } 
    // Preparations for generating
    var msg = parsePropFile(data);
    var ftlVar = createTddFile(tddJsonConfig, msg, currentFile);
    // ftlVar = generateConfiguration(ftlVar);
    // Generate HTML file
    // viewRoot - root for ftl files
    fs.writeFile(path.join(__dirname, '../utils/tdd', currentFile + '.tdd'), JSON.stringify(ftlVar,null, 4), () => {
      ftl2html(path.resolve(pathToTheme, 'login') , path.join(__dirname, '../dist/html/') , currentFile + '.ftl', path.join(__dirname, '../utils/tdd/', currentFile + '.tdd'), 'logFile');
    });  
    
  });
};

/**
 * @description parse message_en.properties into stringify JSON - msg block
 * msg block can contains special expressions - {<number>} and html text.
 * tdd file cannot understand what is that.
 * @param {string} filecontent - content on messasge_en.properties
 * @returns {JSON} msg - message block for tdd files - res: valid JSON
 */
function parsePropFile(filecontent) {
  var msg = {
    msg: {}
  };
  var lines = filecontent.split('\n');
  lines.forEach(line => {
    if (line.charAt(0) !== '#') {
      lineArr = line.split('=');
      param = lineArr[0];
      if (!!lineArr[1] && !!lineArr) {
        msg.msg[param] = lineArr[1].replace('\r', '');
      }
    };
  });
  return msg;
}

/**
 * @description create tdd file from: defult jsonConfig file, 
 * generated from message_en.properties msgBlock JSON, filename 
 * @param {*} jsonConfig - default config file with variables
 * @param {*} msgBlock - generated msg block
 * @param {string} requiredFile - required filename
 */
function createTddFile(jsonConfig, msgBlock, requiredFile) {
  if (!jsonConfig || !msgBlock || !requiredFile) {
    throw new Error('Invalid parameters. Impossible to create tdd file');
  }
  var json = JSON.parse(JSON.stringify(jsonConfig));
  var template = json.template;
  var requiredPage = json[requiredFile];
  //TODO: избавиться от строки ниже после появления аяксов
  var requiredMode = requiredPage['error'];
  Object.keys(template).forEach(elem => {
    requiredMode[elem] = template[elem];
  });
  Object.keys(msgBlock).forEach(elem => {
    requiredMode[elem] = msgBlock[elem];
  });
  
  return requiredMode;
}
