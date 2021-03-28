import express = require("express");

const router = express.Router();
const controllers = require("../controllers/controllers");
const spotifyapi = require("../controllers/spotifyapi");

router.get("/login", spotifyapi.spotify_login);

router.get("/callback", spotifyapi.spotify_callback);

router.get("/refresh_token", spotifyapi.refresh_token);

router.post("/createplaylist", spotifyapi.createPlaylist);

router.post("/addTracks", spotifyapi.addTracks);

module.exports = router;
