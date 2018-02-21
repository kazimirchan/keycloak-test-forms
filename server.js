var express = require('express');
var path = require('path');
var themePath = 'cardpay-open-sans/';
var jsonToHtml = require('./utils/jsonToHtml');
var bodyParser = require("body-parser");
var fs = require('fs');

var app = express();
var jsonParser = bodyParser.json();

app.use(express.static(path.resolve(__dirname + '/dist/public')));
app.use(express.static(path.resolve(__dirname + '/dist/html')));
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/dist/views/index.html');   
});

app.post("/:formName", jsonParser, function (request, response) {
  console.log('FORM NAME ONLY', request.body, !!request.body);
  if(!request.body) return response.sendStatus(400);
  jsonToHtml(path.resolve(__dirname, themePath), request.body.templateName, request.body.templateMode);
  fs.readFile(__dirname + `/dist/html/${request.body.templateName}.html`, data => {
    response.send(data);
  });
});

app.post(`/:formName_:formMode`, jsonParser, function (request, response) {
  console.log('WITH FORM MODE', request.body);
  if(!request.body) return response.sendStatus(400);
  jsonToHtml(path.resolve(__dirname, themePath), request.body.templateName. request.body.templateMode);
  fs.readFile(__dirname + `/dist/html/${request.body.templateName}.html`, data => {
    response.send(data);
  });
});

app.get('/debug', (request, response) => { 
  jsonToHtml(path.resolve(__dirname, themePath), null);
});
 

app.listen(3030);
