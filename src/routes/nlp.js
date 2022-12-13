let express = require("express");
let NlpController = require("../controllers/NlpController");

let router = require("express-promise-router")();

router.get("/", NlpController.index);

router.get("/getDemo", NlpController.demo);
router.post("/", NlpController.handlePost);
module.exports = router;
