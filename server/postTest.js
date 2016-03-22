var request = require('request');

var options = {
  uri: 'http://127.0.0.1:3000/classes/messages',
  method: 'POST',
  json: {longUrl: 'http://www.google.com/',
anotherKey: 123}
};

request(options, function (error, response, body) {
  if (!error && response.statusCode === 200) {
    console.log(body.id); // Print the shortened url.
  }
});

// request.post(
//   'http://127.0.0.1:3000/classes/messages',
//   { data: JSON.stringify({foo: 'bar'})},
//   function(error, response, body) {
//     if (!error && response.statusCode === 200) {
//       console.log(body);
//     }
//   }
// );