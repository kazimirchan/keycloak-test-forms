var express = require('express');
var path = require('path');
var app = express();
var themePath = 'cardpay-open-sans/';
var jsonToHtml = require('./utils/jsonToHtml');

app.use('/', express.static(path.resolve(__dirname + '/dist/public')));
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/dist/views/index.html');   
});

app.get('/:formName', (request, response) => { 
  console.log(`Try getting form ${request.params['formName']}.`);
  jsonToHtml(path.resolve(__dirname, themePath), request.params['formName']);
});

app.get('/debug', (request, response) => { 
  jsonToHtml(path.resolve(__dirname, themePath), null);
});


app.listen(3030);
