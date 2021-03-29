import express = require("express");
import request = require("request");
import SpotifyWebApi = require("spotify-web-api-node");
const db = require("./db");

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.SECRET_ID;
const redirect_uri = process.env.REDIRECT_URI;
const stateKey = "spotify_auth_state";
const acc_refresh_token = process.env.REFRESH_TOKEN;

var spotifyapi: any = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri,
});

//Global Vars

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

const generateRandomString = function (length: number) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const login = (req: express.Request, res: express.Response) => {
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
module.exports.login = login;

const callback = (req: express.Request, res: express.Response) => {
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
module.exports.callback = callback;

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

/**
 * Add Track to Spotify Playlist and Public Playlist
 * @param {string} p_name The playlist's name
 * @param {string} p_desc The playlist description
 * TODO: Register Playlist with Public Playlist DB
 */
const createPlaylist = (req: express.Request, res: express.Response) => {
  const playlist_name: string = req.body.p_name;
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

/**
 * Add Track to Spotify Playlist and Public Playlist
 * @param {string} p_uri The playlist's URI
 * @param {string} track The track's URI
 * Do NOT Include spotify:xxxx: portion, just the unique key
 */
const addTracktoPlaylist = (req: express.Request, res: express.Response) => {
  const playlist_uri: string = req.body.p_uri;
  const track_uri: string = "spotify:track:" + req.body.track;

  spotifyapi.addTracksToPlaylist(playlist_uri, [track_uri]).then(
    (data: JSON) => {
      spotifyapi.getTrack(req.body.track).then((track_data) => {
        db.addTracktoDB({
          uri: track_data.body.uri,
          title: track_data.body.name,
          artist: track_data.body.album.artists[0].name,
          album: track_data.body.album.name,
          album_art: track_data.body.album.images[0].url,
          playlist_uri: playlist_uri,
        });
      });

      console.log("Added track to playlist!");
      res.status(200);
    },
    (err) => {
      console.log("Something went wrong!", err);
    }
  );
};
module.exports.addTracktoPlaylist = addTracktoPlaylist;
