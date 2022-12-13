let express = require("express");
let FacebookController = require("../controllers/FacebookController");

let router = require("express-promise-router")();

router.get("/webhook", FacebookController.getWebhook);

module.exports = router;
