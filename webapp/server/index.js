const express = require('express');
const request = require('request')
const dotenv = require('dotenv');
const path = require('path');

const port = 5000
global.access_token = ''
dotenv.config();

var spotify_client_id = '04d6dc2d0e1f43fd924d9b615d969127';
var spotify_client_private = '6c713003c4d2411c8e0c3ce5eb8258ba';

var spotify_redirect_uri = 'http://localhost:3000/auth/callback'

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


var app = express();
app.use(express.static(path.join(__dirname, '../build')));

app.get('/auth/login', (req, res) => {
    var scope = "streaming user-read-email user-read-private"
    var state = generateRandomString(16);
    
    var auth_query_parameter = new URLSearchParams({
        response_type: "code",
        client_id: spotify_client_id,
        scope: scope,
        redirect_uri: spotify_redirect_uri,
        state: state
    });
    console.log(auth_query_parameter);
    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameter.toString());
});


app.get('/auth/callback', (req, res) => {

  var code = req.query.code;

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: spotify_redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_private).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      res.redirect('/')
    }
  });

})
app.get('/auth/token', (req,res) => {
  res.json({access_token: access_token})
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});
