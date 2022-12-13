let express = require("express");
let FacebookController = require("../controllers/FacebookController");
let router = require("express-promise-router")();

router.post("/webhook", FacebookController.postWebhook);
router.get("/webhook", FacebookController.getWebhook);
router.post("/setup_profile", FacebookController.setupProfile);
router.post("/setup_persistent_menu", FacebookController.setupMenu);
router.get("/devFunctions", FacebookController.devFunctions);
module.exports = router;
