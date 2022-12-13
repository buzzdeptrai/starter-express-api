let express = require("express");
let memberController = require("../controllers/api/MemberController");
let router = require("express-promise-router")();

router.get("/member/", memberController.getUser);
router.patch("/member/", memberController.updateUser);

//router.delete("/member/:userID", memberController.deleteUser);

module.exports = router;
