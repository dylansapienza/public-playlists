import express = require("express");
import querystring = require("querystring");
import request = require("request");
import SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();

//Global Vars

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.SECRET_ID;
const redirect_uri = process.env.REDIRECT_URI;
const stateKey = "spotify_auth_state";
// let access_token = process.env.ACCESS_TOKEN;
const acc_refresh_token = process.env.REFRESH_TOKEN;

var spotifyapi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri,
});

spotifyapi.setRefreshToken(acc_refresh_token);

spotifyapi.refreshAccessToken().then(
  function (data) {
    console.log("The access token has been refreshed!");

    // Save the access token so that it's used in future calls
    spotifyapi.setAccessToken(data.body["access_token"]);
  },
  function (err) {
    console.log("Could not refresh access token", err);
  }
);

const hello_world = (req: express.Request, res: express.Response) => {
  res.send("hello world");
};

module.exports.hello_world = hello_world;

const generateRandomString = function (length: number) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const spotify_login = (req: express.Request, res: express.Response) => {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scopes = [
    "user-read-private",
    "user-read-email",
    "playlist-modify-public",
  ];

  var authorizeURL = spotifyapi.createAuthorizeURL(scopes, state);

  res.redirect(authorizeURL);
};

module.exports.spotify_login = spotify_login;

const spotify_callback = (req: express.Request, res: express.Response) => {
  var code = req.query.code || null;

  spotifyapi.authorizationCodeGrant(code).then(
    function (data) {
      console.log("The token expires in " + data.body["expires_in"]);
      console.log("The access token is " + data.body["access_token"]);
      console.log("The refresh token is " + data.body["refresh_token"]);

      // Set the access token on the API object to use it in later calls
      spotifyapi.setAccessToken(data.body["access_token"]);
      spotifyapi.setRefreshToken(data.body["refresh_token"]);
      res.redirect("/success");
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
};

module.exports.spotify_callback = spotify_callback;

const refresh_token = (req: express.Request, res: express.Response) => {
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
};
module.exports.refresh_token = refresh_token;

const createPlaylist = (req: express.Request, res: express.Response) => {
  const playlist_name: String = req.body.p_name;
  const desc: string = req.body.desc;

  spotifyapi
    .createPlaylist(playlist_name, { description: desc, public: true })
    .then(
      (data) => {
        console.log(data);
        console.log("Created Playlist ", playlist_name);
        res.status(200);
        res.send("Created Playlist " + playlist_name);
      },
      (err) => {
        console.log("Error", err);
      }
    );
};
module.exports.createPlaylist = createPlaylist;

const addTracks = (req: express.Request, res: express.Response) => {
  const playlist_uri: String = req.body.p_uri;
  const track_uri: string = req.body.track;

  spotifyapi.addTracksToPlaylist(playlist_uri, [track_uri]).then(
    function (data) {
      console.log("Added tracks to playlist!");
      res.status(200);
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
};

/**TODO:
Spotify API Side:
  - Reposition Tracks
  - Insert Track at correct position

Server-Side:
  - Vote tracks
  - On adding track, store data
  - On creating playlist, store data

**/

module.exports.addTracks = addTracks;
