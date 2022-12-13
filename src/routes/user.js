let express = require("express");
let UserController = require("../controllers/UserController");

let router = require("express-promise-router")();

router.get("/", UserController.index);
router.post("/", UserController.newUser);

router.get("/:userID", UserController.getUser);
router.patch("/:userID", UserController.updateUser);
router.delete("/:userID", UserController.deleteUser);

module.exports = router;
