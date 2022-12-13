let express = require("express");
let LangController = require("../controllers/LangController");

let router = require("express-promise-router")();

router.get("/", LangController.index);

router.post("/", LangController.newLang);

router.get("/:getID", LangController.getLang);
module.exports = router;
