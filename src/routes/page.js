let express = require("express");
let PageController = require("../controllers/PageController");

let router = require("express-promise-router")();

router.get("/", PageController.index);
router.post("/", PageController.newPage);

router.get("/:pageID", PageController.getPage);

router.patch("/:pageID", PageController.updatePage);
module.exports = router;
