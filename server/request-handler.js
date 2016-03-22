/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
// var data = fs.readFileSync('input.txt');
// console.log("Synchronous read: " + data.toString());

// console.log("Program Ended");

var url = require('url');
var fs = require('fs');
var path = require('path');

var messages = {results: []};

var checkFile = function(fileUrl) {
  var fileType = fileUrl.slice(fileUrl.lastIndexOf('.') + 1, fileUrl.length);
  var result;
  if (fileType === 'js') {
    result = 'application/javascript';
  } else if (fileType === 'css') {
    result = 'text/css';
  }
  return result;
};

var requestHandler = function(request, response) {

  var statusCode, data, file, isFile;
  var headers = defaultCorsHeaders;
  
  var pathTo = '../client/client';
  pathTo = pathTo + request.url;
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  if (request.url === '/') {

    headers['Content-Type'] = 'text/html';
    statusCode = 200;
    data = fs.readFileSync('../client/client/index.html');
    response.writeHead(statusCode, headers);
    response.end(data);

  } else if (request.url !== '/classes/messages') {

    headers['Content-Type'] = checkFile(pathTo);
    try {
      fs.readFileSync(pathTo);
      isFile = true;
    } catch (e) {
      console.log(e);
      isFile = false;
    }
    // console.log(isFile);

    if (isFile) { // test to see if request.url is a file

      statusCode = 200;
      data = fs.readFileSync(pathTo);
      response.writeHead(statusCode, headers);
      response.end(data);

    } else {

      statusCode = 404;
      response.writeHead(statusCode, headers);
      response.end();
    }
  } else {

    headers['Content-Type'] = 'application/json';
    if (request.method === 'GET') {

      statusCode = 200;
      response.writeHead(statusCode, headers);

      response.end(JSON.stringify(messages));

    } else if (request.method === 'POST') {
      var body = '';
      request.on('data', function(chunk) {
        body += chunk;
      });
      request.on('end', function() {
        var newMessage = JSON.parse(body);
        messages.results.push(newMessage);

        statusCode = 201;
        response.writeHead(statusCode, headers);
        response.end();
        // console.log(response);
      });
    } else if (request.method === 'OPTIONS') {
      statusCode = 200;
      response.writeHead(statusCode, headers);
      response.end();
    }
  }
  
};

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'X-Requested-With, X-HTTP-Method-Override, content-type, accept',
  'access-control-allow-credentials': false,
  'access-control-max-age': 10 // Seconds.
};

exports.requestHandler = requestHandler;
