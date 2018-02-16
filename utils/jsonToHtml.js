var tddJsonConfig = require('../config/config.json');
var path = require('path');
var fs = require('fs');

/**
 * @description convert json file into required html 
 * @param {*} pathToTheme 
 * @param {*} currentFile 
 */
module.exports = function jsonToHtml(pathToTheme, currentFile) {
  if (typeof pathToTheme !== "string" || typeof currentFile !== "object") {
    throw new Error('jsonToHtml: Invalid path to theme');
  }
  fs.readFile(path.resolve(pathToTheme, 'login/messages/messages_en.properties'), 'utf-8', (err, data) => {
    if (!!err) {
      throw new Error(err);
    } 
    var msg = parsePropFile(data);
    var jsonFile = createTddFile(tddJsonConfig, msg, currentFile);
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

function createTddFile(jsonConfig, msgBlock, requiredFile) {
  // if (!!jsonConfig || typeof msgBlock !== "object" || typeof requiredFile !== "object") {
  //   throw new Error('cannot create tdd file');
  // }
  var json = JSON.parse(JSON.stringify(jsonConfig));
  var template = json.template;
  // console.log(requiredFile.formName);
  var requiredPage = json[requiredFile.formName];
  var requiredMode = requiredPage[requiredFile.formMode];
  // var resultJSON = JSON.stringify(template.concat(requiredMode,)).concat(JSON.stringify, JSON.stringify(msgBlock));
  requiredMode.template = template;
  requiredMode.msg = msgBlock;
  console.log(JSON.stringify(requiredMode));
}