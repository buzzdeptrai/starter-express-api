let express = require("express");
let memberController = require("../../controllers/api/MemberController");
let router = require("express-promise-router")();

router.get("/:userID", memberController.getUser);
module.exports = router;
