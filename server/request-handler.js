
var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'X-Requested-With, X-HTTP-Method-Override, content-type, accept',
  'access-control-allow-credentials': false,
  'access-control-max-age': 10 // Seconds.
};

var url = require('url');
var fs = require('fs');
var path = require('path');

var messages = fs.readFileSync('messages.json', 'utf8');

if (messages !== '') {
  messages = JSON.parse(messages);
} else {
  messages = {results: []};
}

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

var respond = function(statusCode, data, headers, response) {
  response.writeHead(statusCode, headers);
  response.end(data);
};

var requestHandler = function(request, response) {

  var statusCode, data, file, isFile;
  
  var pathTo = '../client/client';
  pathTo = pathTo + request.url;
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  if (request.url === '/') {

    headers['Content-Type'] = 'text/html';
    data = fs.readFileSync('../client/client/index.html');
    respond(200, data, headers, response);

  } else if (request.url !== '/classes/messages') {

    headers['Content-Type'] = checkFile(pathTo);
    try {
      fs.readFileSync(pathTo);
      isFile = true;
    } catch (e) {
      console.log(e);
      isFile = false;
    }

    if (isFile) { // test to see if request.url is a file
      data = fs.readFileSync(pathTo);
      respond(200, data, headers, response);
    } else {
      respond(404, null, headers, response);
    }
  } else {

    headers['Content-Type'] = 'application/json';
    if (request.method === 'GET') {

      respond(200, JSON.stringify(messages), headers, response);

    } else if (request.method === 'POST') {
      var body = '';
      request.on('data', function(chunk) {
        body += chunk;
      });
      request.on('end', function() {
        var newMessage = JSON.parse(body);
        messages.results.unshift(newMessage);

        fs.writeFile('messages.json', JSON.stringify(messages), function(err) {
          if (err) {
            console.log(err);
            return;
          }
          console.log('saved');
        });
        respond(201, null, headers, response);
      });
    } else if (request.method === 'OPTIONS') {
      respond(200, null, headers, response);
    }
  }
};

exports.requestHandler = requestHandler;
