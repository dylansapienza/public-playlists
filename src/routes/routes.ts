import express = require("express");

const router = express.Router();
const controllers = require("../controllers/controllers");
const spotifyapi = require("../controllers/spotifyapi");
const database = require("../controllers/db");

router.get("/login", spotifyapi.login);

router.get("/callback", spotifyapi.callback);

router.get("/refresh_token", spotifyapi.refresh_token);

router.post("/createplaylist", spotifyapi.createPlaylist);

router.post("/addTracks", spotifyapi.addTracktoPlaylist);

router.post("/castBallot", database.voteOnSong);

router.post("/reorderPlaylist", spotifyapi.reorderPlaylist);

module.exports = router;
