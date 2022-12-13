let express = require("express");
let ProductsController = require("../controllers/ProductsController");

let router = require("express-promise-router")();
function middle(req, res, next) {
  // some code;
  console.log("sample middle");
  next();
}

router.get("/", ProductsController.index);
router.get("/buzz", middle, function (req, res) {
  console.log("url is working");
  res.send("Chat server is working!");
});
router.get("/:idGet", ProductsController.getProductByID);
router.post("/", ProductsController.newProduct);
module.exports = router;
