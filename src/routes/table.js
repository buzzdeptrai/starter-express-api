let express = require("express");
let TableController = require("../controllers/TableController");

let router = require("express-promise-router")();

router.get("/", TableController.index);
router.post("/", TableController.newTable);

router.patch("/:tableID", TableController.updateTable);
module.exports = router;
