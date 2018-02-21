var tddJsonConfig = require('../config/config.json');
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var ftl2html = require('ftl2html');
var mergeJSON = require('merge-json');

/**
 * @description convert json file into required html 
 * @param {string} pathToTheme - path to linked theme in our project
 * @param {string} currentFile - filename for converting
 * @param {string} currentFileModes - modes for current file: `mode(_mode)*`
 */
module.exports = function jsonToHtml(pathToTheme, currentFile, currentFileModes) {
  if (typeof pathToTheme !== "string" || typeof currentFile !== "string") {
    throw new Error('jsonToHtml: Invalid path to theme: ' + pathToTheme + ' ' + currentFile);
  }
  fs.readFile(path.resolve(pathToTheme, 'login/messages/messages_en.properties'), 'utf-8', (err, data) => {
    if (!!err) {
      throw new Error(err);
    } 
    // Preparations for generating
    var msg = parsePropFile(data);
    var ftlVar = createTddFile(tddJsonConfig, msg, currentFile, currentFileModes);
    
    // Generate HTML file
    // viewRoot - root for ftl files
    fs.writeFile(path.join(__dirname, '../utils/tdd', currentFile + '.tdd'), JSON.stringify(ftlVar,null, 2), () => {
      copyRequiredStyles(path.resolve(pathToTheme, 'login'), path.join(__dirname, '../dist/html/html'));
      ftl2html(path.resolve(pathToTheme, 'login') , path.join(__dirname, '../dist/html') , currentFile + '.ftl', path.join(__dirname, '../utils/tdd/', currentFile + '.tdd'), 'logFile');
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
 * @param {JSON} jsonConfig - default config file with variables
 * @param {JSON} msgBlock - generated msg block for tdd file
 * @param {string} requiredFile - required filename
 * @param {string} requiredFileModes - required modes for file in regexpr `mode(_mode)*`
 */
function createTddFile(jsonConfig, msgBlock, requiredFile, requiredFileModes) {
  if (!jsonConfig || !msgBlock || !requiredFile) {
    throw new Error('Invalid parameters. Impossible to create tdd file');
  }
  var json = JSON.parse(JSON.stringify(jsonConfig));
  var template = json['template'];
  var requiredPage = json[requiredFile];
  var resultJSON = mergeJSON.merge(template, requiredPage['']);
  var requiredJsonMode;
  fileModesArray = requiredFileModes.split('_');
  
  fileModesArray.forEach( fileMode => {
    console.log('PAGE MODE ' + fileMode);
    requiredJsonMode = requiredPage[fileMode];
    resultJSON = mergeJSON.merge(resultJSON, requiredJsonMode);
  });
  resultJSON = mergeJSON.merge(resultJSON, msgBlock);
  return resultJSON;
}

/**
 * @description 
 * @param {*} pathToTemplates 
 * @param {*} outputPath
 */
function copyRequiredStyles(pathToTemplates, outputPath) {
  var resourcePath = path.resolve(pathToTemplates, 'resources');
  if (typeof pathToTemplates !== "string" || !fs.existsSync(resourcePath)) {
    throw new Error('Cannot copy static files with bad path : ' + resourcePath);
  }
  if (!fs.existsSync(path.resolve(outputPath, 'css'))) {
    fse.copySync(resourcePath, outputPath);
  }
}
