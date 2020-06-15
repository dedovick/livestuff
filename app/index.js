/*
Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

    http://aws.amazon.com/apache2.0/

or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

*/

// Define our dependencies
var express        = require('express');
var session        = require('express-session');
var passport       = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var request        = require('request');
var handlebars     = require('handlebars');
const cors         = require('cors');

// Define our constants, you will change these with your own
const TWITCH_CLIENT_ID = 'n1mks25mv29boj77of0ypwwrjncnpb';
const TWITCH_SECRET    = '9soyd6qedruq6fm7jqqj3u5twdl8o6';
const SESSION_SECRET   = 'TEST123';
const CALLBACK_URL     = 'http://localhost:3000/auth/twitch/callback';  // You can run locally with - http://localhost:3000/auth/twitch/callback

// Initialize Express and middlewares
var app = express();
app.use(cors())
app.use(session({secret: SESSION_SECRET, resave: false, saveUninitialized: false}));
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

let gameList = [];
let gameCatList = [];
let isUpdating = false;
let userLoginList = [
  'gaules',
  'rakin',
  'hastad',
  'hiko',
  'zigueira',
  'jovirone',
  'gratis150ml',
  'renansouzones',
  'riotgamesbrazil',
  'lec',
  'faker',
  'baiano',
  'dreamhackcs',
  'esl_csgo',
  'blastdota',
  'capitaomarulho',
  'mattarsayuri',
  'fextralife',
  'auronplay',
  'tfue',
  'summit1g',
  'xqcow',
  'alanzoka',
  'gafallen',
  'yoda',
  'titanlol1',
  'coldzin',
  'jukes',
  'camilotaxp',
  'netenho1',
  'nickmercs',
  'asmongold',
  'pestily',
  'thegrefg',
  'lpl',
  'riotgamesjp',
  'lcs',
  'twitchrivals',
  'zigueira',
  'thedarkness'
];


// Override passport profile function to get user profile from Twitch API
OAuth2Strategy.prototype.userProfile = function(accessToken, done) {
  var options = {
    url: 'https://api.twitch.tv/helix/users',
    method: 'GET',
    headers: {
      'Client-ID': TWITCH_CLIENT_ID,
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Authorization': 'Bearer ' + accessToken
    }
  };

  request(options, function (error, response, body) {
    if (response && response.statusCode == 200) {
      done(null, JSON.parse(body));
    } else {
      console.log('BBBBBBBBBBBBBB: ' + JSON.stringify(body));
      done(JSON.parse(body));
    }
  });
}

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use('twitch', new OAuth2Strategy({
    authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
    tokenURL: 'https://id.twitch.tv/oauth2/token',
    clientID: TWITCH_CLIENT_ID,
    clientSecret: TWITCH_SECRET,
    callbackURL: CALLBACK_URL,
    state: true
  },
  function(accessToken, refreshToken, profile, done) {
    // console.log('XXXXXXXX: ' + accessToken);
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;

    // Securely store user profile in your DB
    //User.findOrCreate(..., function(err, user) {
    //  done(err, user);
    //});

    done(null, profile);
  }
));

// Set route to start OAuth link, this is where you define scopes to request
app.get('/auth/twitch', passport.authenticate('twitch', { scope: 'user_read' }));

// Set route for OAuth redirect
app.get('/auth/twitch/callback', passport.authenticate('twitch', { successRedirect: '/streamlist', failureRedirect: '/adasdasd' }));

// Define a simple template to safely generate HTML with values from user's profile
var template = handlebars.compile(`
<html><head><title>Twitch Auth Sample</title></head>
<table>
    <tr><th>Access Token</th><td>{{accessToken}}</td></tr>
    <tr><th>Refresh Token</th><td>{{refreshToken}}</td></tr>
    <tr><th>Display Name</th><td>{{display_name}}</td></tr>
    <tr><th>Bio</th><td>{{bio}}</td></tr>
    <tr><th>Image</th><td>{{logo}}</td></tr>
</table></html>`);

// If user has an authenticated session, display it, otherwise display link to authenticate
app.get('/', function (req, res) {
  if(req.session && req.session.passport && req.session.passport.user) {
    res.send(template(req.session.passport.user));
  } else {
    res.send('<html><head><title>Twitch Auth Sample</title></head><a href="/auth/twitch"><img src="http://ttv-api.s3.amazonaws.com/assets/connect_dark.png"></a></html>');
  }
});

app.listen(3000, function () {
  console.log('Twitch auth sample listening on port 3000!');
  passport.authenticate('twitch', { scope: 'user_read' });
});

app.get('/streams', function (req, res) {
  console.log('CLIENT-ID: ' + TWITCH_CLIENT_ID);
  console.log('Authorization: ' + `Bearer ${req.session.passport.user.accessToken}`);
  if(req.session && req.session.passport && req.session.passport.user) {
    var options = {
      url: 'https://api.twitch.tv/helix/streams?first=20&user_login=rakin&user_login=gaules',
      method: 'GET',
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Authorization': 'Bearer ' + req.session.passport.user.accessToken
      }
    };
  
    request(options, function (error, response, body) {
      if (response && response.statusCode == 200) {
        console.log('CHEGOOOOOOOOOOUT: ' + JSON.stringify(body));
      } else {
        console.log('LASCOOOOOOOOOOOOU: ' + JSON.stringify(body));
      }
    });
  } else {
    res.send('<html><head><title>Twitch Auth Sample</title></head><a href="/auth/twitch"><img src="http://ttv-api.s3.amazonaws.com/assets/connect_dark.png"></a></html>');
  }
})

app.get('/topgames', function (req, res) {
  console.log('CLIENT-ID: ' + TWITCH_CLIENT_ID);
  console.log('Authorization: ' + `Bearer ${req.session.passport.user.accessToken}`);
  if(req.session && req.session.passport && req.session.passport.user) {
    var options = {
      url: 'https://api.twitch.tv/helix/games/top',
      method: 'GET',
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Authorization': 'Bearer ' + req.session.passport.user.accessToken
      }
    };
  
    request(options, function (error, response, body) {
      if (response && response.statusCode == 200) {
        console.log('CHEGOOOOOOOOOOUT: ' + JSON.stringify(body));
      } else {
        console.log('LASCOOOOOOOOOOOOU: ' + JSON.stringify(body));
      }
    });
  } else {
    res.send('<html><head><title>Twitch Auth Sample</title></head><a href="/auth/twitch"><img src="http://ttv-api.s3.amazonaws.com/assets/connect_dark.png"></a></html>');
  }
})


app.get('/getusers', function (req, res) {
  console.log('CLIENT-ID: ' + TWITCH_CLIENT_ID);
  console.log('Authorization: ' + `Bearer ${req.session.passport.user.accessToken}`);
  if(req.session && req.session.passport && req.session.passport.user) {
    var options = {
      url: 'https://api.twitch.tv/helix/users?login=gaules&login=rakin',
      method: 'GET',
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Authorization': 'Bearer ' + req.session.passport.user.accessToken
      }
    };
  
    request(options, function (error, response, body) {
      if (response && response.statusCode == 200) {
        console.log('CHEGOOOOOOOOOOUT: ' + JSON.stringify(body));
      } else {
        console.log('LASCOOOOOOOOOOOOU: ' + JSON.stringify(body));
      }
    });
  } else {
    res.send('<html><head><title>Twitch Auth Sample</title></head><a href="/auth/twitch"><img src="http://ttv-api.s3.amazonaws.com/assets/connect_dark.png"></a></html>');
  }
})

app.get('/getstreamlist', function(req, res) {
  printGameList();
  res.send(gameList);
})

app.get('/streamlist', function (req, res) {
  gameList = [];
  if(req.session && req.session.passport && req.session.passport.user) {
    if(!isUpdating) {
      streamListUpdate(req.session.passport.user.accessToken);
      isUpdating = true;
    } 
    res.send(template(req.session.passport.user));
  } else {
    isUpdating = false
    res.send('<html><head><title>Twitch Auth Sample</title></head><a href="/auth/twitch"><img src="http://ttv-api.s3.amazonaws.com/assets/connect_dark.png"></a></html>');
  }
})

function streamListUpdate(accessToken) {
  gameList = [];
  //var accessTokenAux = req.session.passport.user.accessToken;
  var options = {
    url: 'https://api.twitch.tv/helix/games/top?first=10',
    method: 'GET',
    headers: {
      'Client-ID': TWITCH_CLIENT_ID,
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Authorization': 'Bearer ' + accessToken
    }
  };

  request(options, function (error, response, body) {
    if (response && response.statusCode == 200) {
      data = JSON.parse(body);
      gameIdList = [];
      data.data.forEach(element => {
        if (!gameCatList.includes(element)) {
          gameCatList.push(element);
        }
        //console.log('Name: ' + element.name + ' - ID: ' + element.id);
        gameIdList.push(element.id);
      });
      getStreamByGameId(gameIdList, accessToken);
      setTimeout(function() {
        streamListUpdate(accessToken)
      }, 180000);
    } else {
      var options = {
        url: 'http://localhost:3000/auth/twitch/auth/twitch',
        method: 'GET',
        headers: {}
      };
      isUpdating = false;
      request(options, function (error, response, body) {});
      console.log('LASCOOOOOOOOOOOOU: ' + JSON.stringify(body));
    }
    });

}

function getStreamByGameId(gameIdList, accessToken){
  url = 'https://api.twitch.tv/helix/streams?language=pt';
  fisrt = true;
  gameIdList.forEach(element => {
    url = url + '&game_id=' + element
    console.log('game_id: ' + element);
  })
  var options = {
    url: url,
    method: 'GET',
    headers: {
      'Client-ID': TWITCH_CLIENT_ID,
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Authorization': 'Bearer ' + accessToken
    }
  };

  request(options, function (error, response, body) {
    if (response && response.statusCode == 200) {
      data = JSON.parse(body);
      streamList = [];
      data.data.forEach(element => {
        checkAndAdd(element, accessToken);
      });
      getStreamById(accessToken);
    } else {
      console.log('LASCOOOOOOOOOOOOU: ' + JSON.stringify(body));
    }
  });
}

function getStreamById(accessToken){
  url = 'https://api.twitch.tv/helix/streams?';
  fisrt = true;
  userLoginList.forEach(element => {
    url = url + '&user_login=' + element
  })
  var options = {
    url: url,
    method: 'GET',
    headers: {
      'Client-ID': TWITCH_CLIENT_ID,
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Authorization': 'Bearer ' + accessToken
    }
  };

  request(options, function (error, response, body) {
    if (response && response.statusCode == 200) {
      data = JSON.parse(body);
      streamList = [];
      data.data.forEach(element => {
        console.log('user_id: ' + element.id);
        checkAndAdd(element, accessToken);
      });
      printGameList();
    } else {
      console.log('LASCOOOOOOOOOOOOU: ' + JSON.stringify(body));
    }
  });
}

function checkAndAdd(streamObj, accessToken) {
  var found = false;
  for(var i = 0; i < gameList.length; i++) {
      if (gameList[i].id === streamObj.id) {
          found = true;
          break;
      }
  }
  if(!found && streamObj.type == 'live'){
    streamObj.game_id = getGameName(streamObj.game_id, accessToken);
    gameList.push(streamObj);
  }
}


function printGameList(){
  function compare(a, b) {
    if (a.viewer_count > b.viewer_count) return -1;
    if (b.viewer_count > a.viewer_count) return 1;
  
    return 0;
  }

  gameList.sort(compare);

  for(var i = 0; i < gameList.length; i++) {
    streamObj = gameList[i];
    console.log('GAMEID: ' + streamObj.game_id + ' - ID: ' + streamObj.id + ' - LANGUAGE: ' + streamObj.language + 
       ' - TITTLE: ' + streamObj.title + ' - USERNAME: ' + streamObj.user_name + ' - VIEWERCOUNTER: ' + streamObj.viewer_count);
  }
}

function getGameName(id, accessToken) {
  for(var i = 0; i < gameCatList.length; i++) {
    if (gameCatList[i].id === id) {
        return gameCatList[i].name;
    }
  }

  url = 'https://api.twitch.tv/helix/games?';
  url = url + '&id=' + id
  var options = {
    url: url,
    method: 'GET',
    headers: {
      'Client-ID': TWITCH_CLIENT_ID,
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Authorization': 'Bearer ' + accessToken
    }
  };

  request(options, function (error, response, body) {
    if (response && response.statusCode == 200) {
      data = JSON.parse(body);
      gameCatList.push(data.data[0]);
    } else {
      console.log('LASCOOOOOOOOOOOOU: ' + JSON.stringify(body));
    }
  });
  return id;
}



// https://api.twitch.tv/helix/games/top
// https://api.twitch.tv/helix/streams?first=20