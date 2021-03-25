import express = require("express");

const router = express.Router;
const controllers = require("../controllers/controllers");

router.get("/hello_world", controllers.hello_world);

module.exports = router;
