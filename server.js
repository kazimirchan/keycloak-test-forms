var express = require('express');
var path = require('path');
var app = express();

app.use('/', express.static(path.resolve(__dirname + '/dist/public')));
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/dist/views/index.html');
  // response.sendFile(__dirname + '/dist/views/index.html');   
});
app.get('/:formName/:formMode', (request, response) => { 
  console.log(`Try getting form ${formName} with mode ${formMode}.`);
});
app.get('/debug', (request, response) => {
  response.sendFile('h1');
});
app.listen(3030);