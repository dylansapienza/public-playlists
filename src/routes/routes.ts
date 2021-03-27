import express = require("express");

const router = express.Router();
const controllers = require("../controllers/controllers");

router.get("/hello_world", controllers.hello_world);

router.get("/login", controllers.spotify_login);

router.get("/callback", controllers.spotify_callback);

router.get("/refresh_token", controllers.refresh_token);

router.post("/createplaylist", controllers.createPlaylist);

module.exports = router;
