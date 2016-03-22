/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var url = require('url');
var qs = require('querystring');
var messages = {results: [{username: 'foo',
message: 'bar',
roomname: 'lobby'}]};

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var statusCode;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'JSON';
  

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
    
  }
  
};

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

exports.requestHandler = requestHandler;
