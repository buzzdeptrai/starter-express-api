const router = require("express-group-router");

let webRouter = require("./web");

//let authApiMember = require("../middleware/auth_api_member");

function route(app) {
  app.use("/", webRouter);
}
module.exports = route;
