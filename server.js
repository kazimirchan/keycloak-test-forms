var express = require('express');
var path = require('path');
var app = express();
var themePath = 'cardpay-open-sans/';
var jsonToHtml = require('./utils/jsonToHtml');
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var fs = require('fs');

app.use('/', express.static(path.resolve(__dirname + '/dist/public')));
app.use('/', express.static(path.resolve(__dirname + '/dist/html')));
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/dist/views/index.html');   
});

app.post("/:formName", jsonParser, function (request, response) {
  console.log(request.body);
  if(!request.body) return response.sendStatus(400);
  jsonToHtml(path.resolve(__dirname, themePath), request.body.templateName);
  response.send(fs.readFileSync(__dirname + `/dist/html/${request.body.templateName}.html`));
});

app.get('/debug', (request, response) => { 
  jsonToHtml(path.resolve(__dirname, themePath), null);
});


app.listen(3030);
